import React from "react";
import { 
  Lock, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CheckCircle, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle,
  Loader2,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Order } from "../types";

interface CheckoutPageProps {
  onOrderComplete: (order: Order, emailNotificationSent: boolean) => void;
  onCancel: () => void;
}

// Colombian departments and major cities dictionary for high fidelity dropdown autocomplete
const DEPARTAMENTOS_DICT: Record<string, string[]> = {
  "Cundinamarca": ["Bogotá, D.C.", "Chía", "Soacha", "Zipaquirá", "Facatativá", "Fusagasugá"],
  "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí", "Rionegro", "Sabaneta", "Apartadó"],
  "Valle del Cauca": ["Cali", "Palmira", "Buga", "Tuluá", "Buenaventura", "Cartago"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
  "Bolívar": ["Cartagena", "Turbaco", "Magangué"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "Caldas": ["Manizales", "Chinchiná", "La Dorada"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona"],
  "Quindío": ["Armenia", "Calarcá", "Tebaida"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Villa de Leyva"]
};

export default function CheckoutPage({ onOrderComplete, onCancel }: CheckoutPageProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [departamento, setDepartamento] = React.useState("Cundinamarca");
  const [city, setCity] = React.useState("Bogotá, D.C.");
  
  // Payment methods matching layout instructions
  // "CARD" -> Tarjetas de Crédito y PSE unificado, "NEQUI" -> Nequi / Daviplata, "WHATSAPP" -> Concretar por Whatsapp
  const [paymentOption, setPaymentOption] = React.useState<"CARD" | "NEQUI" | "WHATSAPP">("CARD");

  // Sub-option inside CARD selection: "CARD" | "PSE"
  const [cardSubOption, setCardSubOption] = React.useState<"CARD" | "PSE">("CARD");

  // State control: "FORM" | "ONLINE_PORTAL" | "LOADING"
  const [checkoutStep, setCheckoutStep] = React.useState<"FORM" | "PORTAL" | "LOADING">("FORM");

  // Portal payment input simulation details
  const [holderName, setHolderName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [pseBank, setPseBank] = React.useState("Bancolombia");
  const [nequiPhone, setNequiPhone] = React.useState("");
  const [portalError, setPortalError] = React.useState("");

  const BASE_PRICE = 179900;
  const totalPrice = BASE_PRICE * quantity;

  // Handle department change -> reset city to first of that list
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setDepartamento(dept);
    if (DEPARTAMENTOS_DICT[dept]) {
      setCity(DEPARTAMENTOS_DICT[dept][0]);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor ingrese su Nombre Completo.");
      return;
    }
    if (!phone.trim()) {
      alert("Por favor ingrese su Teléfono Celular.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Por favor ingrese un Correo Electrónico válido.");
      return;
    }
    if (!address.trim()) {
      alert("Por favor ingrese la Dirección de Entrega.");
      return;
    }

    if (paymentOption === "WHATSAPP") {
      submitToBackend("Concretar compra vía WhatsApp de forma asistida.");
    } else {
      // Set holder name draft
      setHolderName(name);
      setCheckoutStep("PORTAL");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalError("");

    if (paymentOption === "CARD") {
      if (cardSubOption === "CARD") {
        if (!cardNumber.replace(/\s/g, "") || cardNumber.length < 15) {
          setPortalError("Por favor ingrese un número de tarjeta de crédito válido.");
          return;
        }
        if (!holderName.trim()) {
          setPortalError("Por favor ingrese el titular de la tarjeta.");
          return;
        }
        if (!expiry.trim() || !expiry.includes("/")) {
          setPortalError("Por favor ingrese la fecha de vencimiento (MM/AA).");
          return;
        }
        if (cvv.length < 3) {
          setPortalError("Por favor ingrese el código de seguridad (CVV).");
          return;
        }
        submitToBackend(`Tarjeta de crédito de titular: ${holderName} (Terminada en ${cardNumber.slice(-4)})`, "Tarjeta");
      } else {
        submitToBackend(`PSE Pago con Banco: ${pseBank}`, "PSE");
      }
    } else if (paymentOption === "NEQUI") {
      if (!nequiPhone.trim() || nequiPhone.length < 10) {
        setPortalError("Por favor ingrese un número de celular de Nequi / Daviplata válido (10 dígitos).");
        return;
      }
      submitToBackend(`Billetera Móvil Nequi / Daviplata: ${nequiPhone}`, "Nequi");
    }
  };

  const submitToBackend = async (extraDetailMessage: string, methodOverride?: "Tarjeta" | "PSE" | "Nequi" | "WhatsApp") => {
    setCheckoutStep("LOADING");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Payment mapping for server
    const serverPaymentMethod = 
      methodOverride ? methodOverride :
      paymentOption === "CARD" ? "Tarjeta" : 
      paymentOption === "NEQUI" ? "Nequi" : "WhatsApp";

    const transactionId = `${serverPaymentMethod.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderPayload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: `${address} (${departamento})`,
      customerCity: city,
      paymentMethod: serverPaymentMethod,
      amount: totalPrice,
      paymentDetails: {
        transactionId: transactionId,
        extraMessage: extraDetailMessage
      },
      items: [
        {
          name: "Mi 20W Wireless Car Charger",
          price: BASE_PRICE,
          quantity: quantity
        }
      ]
    };

    // If checkout through WhatsApp is chosen, compile message content to launch WhatsApp Web
    const whatsappRedirect = () => {
      const waNumber = "573000000000"; // Xiaomi CarTech Colombia support phone line
      const text = `*¡Hola Xiaomi CarTech!* 📱🚗\n\nDeseo concretar la compra de mi cargador de auto a través de xiaomicartech.com.co. Aquí están mis detalles de envío:\n\n*Pedido ID:* _${transactionId}_\n*Nombre:* ${name}\n*Celular:* ${phone}\n*Ciudad:* ${city} (${departamento})\n*Dirección:* ${address}\n*Cantidad:* ${quantity} unidad(es)\n*Total a pagar:* $${totalPrice.toLocaleString("es-CO")} COP\n\n_Por favor, asistirme con los datos de cuenta o QR para realizar el pago de inmediato. ¡Muchas gracias!_`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderPayload)
      });
      
      const resData = await response.json();
      if (resData.success) {
        if (paymentOption === "WHATSAPP") {
          whatsappRedirect();
        }
        onOrderComplete(resData.order, resData.emailSent);
      } else {
        alert(`Error al registrar el pedido: ${resData.error || 'No se pudo guardar el pedido'}`);
        setCheckoutStep("FORM");
      }
    } catch (err) {
      console.error("Backend post order failed, launching local mode:", err);
      // Offline / network failure resilience
      const fallbackOrder: Order = {
        id: `XM-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: `${address} (${departamento})`,
        customerCity: city,
        paymentMethod: serverPaymentMethod as any,
        paymentDetails: { transactionId, extraMessage: extraDetailMessage },
        amount: totalPrice,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        items: [{ name: "Mi 20W Wireless Car Charger", price: BASE_PRICE, quantity }]
      };
      
      if (paymentOption === "WHATSAPP") {
        whatsappRedirect();
      }
      onOrderComplete(fallbackOrder, false);
    }
  };

  return (
    <div className="bg-gray-50/50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb back to landing */}
        <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500">
          <button 
            onClick={onCancel}
            className="hover:text-[#ff6900] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Inicio
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900">Finalizar Compra</span>
        </div>

        {/* Secure Head Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff6900]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Finalizar Compra Segura
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Estás en una pasarela con cifrado de seguridad SSL de 256 bits.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Conexión En Línea
            </span>
          </div>
        </div>

        {/* Process Steps Visual Tracker */}
        {checkoutStep === "LOADING" ? (
          <div className="bg-white rounded-3xl p-16 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
            <Loader2 className="w-12 h-12 text-[#ff6900] animate-spin" />
            <h2 className="text-xl font-extrabold text-gray-950 mt-6 md:text-2xl">Confirmando Pedido Oficial...</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
              Registrando datos de envío y procesando transacciones seguras con Resend Email notifications para {email}. Espera un momento por favor.
            </p>
          </div>
        ) : checkoutStep === "PORTAL" ? (
          /* Simulated Online Gateway Portal Step */
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handlePortalSubmit} className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100 space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <button 
                  type="button" 
                  onClick={() => setCheckoutStep("FORM")}
                  className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver al formulario
                </button>
                <span className="text-sm text-[#ff6900] font-bold font-mono">
                  $ {totalPrice.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">PASARELA DE SIMULACIÓN</span>
                  <span className="text-base font-extrabold text-gray-950 block">
                    {paymentOption === "CARD" ? `Pago con ${cardSubOption === "CARD" ? "Tarjeta de Crédito" : "PSE"}` : "Pago con Billetera Digital"}
                  </span>
                </div>
                <div className="bg-white/90 py-1 px-3 rounded-lg border text-xs font-extrabold text-gray-700">
                  Wompi / Bold Secure
                </div>
              </div>

              {portalError && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold leading-normal">
                  ⚠️ {portalError}
                </div>
              )}

              {paymentOption === "CARD" && (
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setCardSubOption("CARD");
                      setPortalError("");
                    }}
                    className={`flex-1 text-center py-2.5 px-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      cardSubOption === "CARD" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <span className="inline sm:hidden">💳 Tarjeta</span>
                    <span className="hidden sm:inline">💳 Tarjeta de Crédito/Débito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCardSubOption("PSE");
                      setPortalError("");
                    }}
                    className={`flex-1 text-center py-2.5 px-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      cardSubOption === "PSE" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <span className="inline sm:hidden">⚡ PSE</span>
                    <span className="hidden sm:inline">⚡ PSE (Débito Seguro)</span>
                  </button>
                </div>
              )}

              {paymentOption === "CARD" && cardSubOption === "CARD" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Titular de la Tarjeta</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. Juan Pérez" 
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Número de Tarjeta (16 dígitos)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required 
                        maxLength={19}
                        placeholder="4500 1234 5678 9010" 
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          // Add space grouping
                          const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                          setCardNumber(formatted);
                        }}
                        className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none font-mono"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vence (MM/AA)</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/AA" 
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 2) {
                            value = value.substring(0, 2) + "/" + value.substring(2, 4);
                          }
                          setExpiry(value);
                        }}
                        className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl text-center focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CVC / CVV</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="***" 
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl text-center focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentOption === "CARD" && cardSubOption === "PSE" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Selecciona tu Banco de Preferencia</label>
                    <select 
                      value={pseBank}
                      onChange={(e) => setPseBank(e.target.value)}
                      className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none bg-white font-medium"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                      <option value="Banco de Occidente">Banco de Occidente</option>
                      <option value="Banco Popular">Banco Popular</option>
                      <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                      <option value="Banco Falabella">Banco Falabella</option>
                      <option value="Nequi">Nequi (vía PSE)</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Al proceder serás redirigido a la plataforma oficial de PSE de tu banco seleccionado para validar tu pago seguro de manera totalmente directa.
                  </p>
                </div>
              )}

              {paymentOption === "NEQUI" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Número de celular Nequi o Daviplata (10 dígitos)</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        required 
                        maxLength={10}
                        placeholder="Ej. 3001234567" 
                        value={nequiPhone}
                        onChange={(e) => setNequiPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none font-bold"
                      />
                      <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Recibirás una solicitud de pago push directamente en la app registrada de Nequi/Daviplata para confirmar con tu clave de seguridad.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-950 text-xs flex gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Entorno Demostrativo:</strong> Esta sección simula la pasarela de pagos oficial. Al dar clic en "Aprobar Compra" se generará de manera real el registro de compra y la notificación por correo electrónico.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff6900] hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm tracking-wide uppercase transition-all duration-150 cursor-pointer shadow-md"
              >
                <Lock className="w-4 h-4" />
                Aprobar Compra Simulada ({totalPrice.toLocaleString("es-CO")} COP)
              </button>
            </form>
          </div>
        ) : (
          /* Main Form Wrapping Checkout Layout with shipping on top and payment/summary side-by-side */
          <form onSubmit={handleNextStep} className="space-y-8">
            
            {/* Card 1: Información de Envío (Full Width on Top) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-xs text-left w-full">
              <h2 className="text-xl font-bold text-gray-950 border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
                <span>1. Información de Envío</span>
                <span className="text-xs bg-orange-100 text-[#ff6900] font-bold px-3 py-1 rounded-full uppercase">Estándar Gratis</span>
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre Completo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. Juan Pérez" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Teléfono Celular</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        required 
                        placeholder="Ej. 300 123 4567" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Correo Electrónico</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required 
                        placeholder="correo@ejemplo.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Dirección de Entrega</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      placeholder="Calle, Carrera, Número, Apartamento" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Departamento</label>
                    <select 
                      value={departamento}
                      onChange={handleDeptChange}
                      className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none bg-white font-medium"
                    >
                      {Object.keys(DEPARTAMENTOS_DICT).map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Ciudad</label>
                    <select 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-sm border border-gray-200 px-4 py-3 rounded-xl focus:ring-1 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none bg-white font-medium"
                    >
                      {(DEPARTAMENTOS_DICT[departamento] || ["Bogotá, D.C."]).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Grid for Payment Method and Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Card 2: Método de Pago */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-xs text-left flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-950 border-b border-gray-100 pb-4 mb-6">
                    2. Método de Pago
                  </h2>

                  <div className="space-y-4">
                    {/* Option 1: Credit cards & PSE (Unified) */}
                    <label className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition gap-3 ${
                      paymentOption === "CARD" ? "border-[#ff6900] bg-orange-50/10 text-gray-950 font-bold" : "border-gray-200 bg-white"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input 
                          type="radio" 
                          name="payment_opt"
                          checked={paymentOption === "CARD"}
                          onChange={() => setPaymentOption("CARD")}
                          className="w-4 h-4 text-[#ff6900] focus:ring-[#ff6900] accent-[#ff6900] mt-1 sm:mt-0"
                        />
                        <div className="text-left font-sans">
                          <span className="text-sm block">Tarjetas de Crédito, Débito y PSE</span>
                          <span className="text-xs text-gray-400 font-semibold uppercase block mt-0.5">Visa, Mastercard, AMEX y PSE</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 text-gray-400 items-center self-end sm:self-auto">
                        <CreditCard className="w-5 h-5" />
                        <div className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold py-1 px-2 rounded-md uppercase font-sans">
                          PSE
                        </div>
                      </div>
                    </label>

                    {/* Option 3: Nequi / Daviplata */}
                    <label className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition gap-3 ${
                      paymentOption === "NEQUI" ? "border-[#ff6900] bg-orange-50/10 text-gray-950 font-bold" : "border-gray-200 bg-white"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input 
                          type="radio" 
                          name="payment_opt"
                          checked={paymentOption === "NEQUI"}
                          onChange={() => setPaymentOption("NEQUI")}
                          className="w-4 h-4 text-[#ff6900] focus:ring-[#ff6900] accent-[#ff6900] mt-1 sm:mt-0"
                        />
                        <div className="text-left">
                          <span className="text-sm block">Nequi / Daviplata</span>
                          <span className="text-xs text-gray-400 font-semibold block mt-0.5">Celular registrado</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-slate-100 py-1 px-2.5 rounded-md self-end sm:self-auto">Celular</span>
                    </label>

                    {/* Option 4: WhatsApp Completion (Requested specifically) */}
                    <label className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between cursor-pointer transition gap-3 h-full ${
                      paymentOption === "WHATSAPP" ? "border-green-500 bg-green-50/10 text-gray-950 font-bold" : "border-gray-200 bg-white"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input 
                          type="radio" 
                          name="payment_opt"
                          checked={paymentOption === "WHATSAPP"}
                          onChange={() => setPaymentOption("WHATSAPP")}
                          className="w-4 h-4 text-green-600 focus:ring-green-600 accent-green-600 mt-1"
                        />
                        <div className="text-left">
                          <span className="text-sm block flex flex-wrap items-center gap-1.5 font-bold">
                            Compra Asistida por WhatsApp
                            <span className="bg-green-100 text-green-800 text-[9px] py-0.5 px-2 rounded-full font-bold">INMEDIATO</span>
                          </span>
                          <span className="text-xs text-gray-400 font-semibold block mt-1 leading-normal">
                            Diligencia tus datos de envío arriba y te direccionaremos para pagar con QR o cuenta con soporte experto.
                          </span>
                        </div>
                      </div>
                      <MessageCircle className="w-5 h-5 text-green-600 shrink-0 self-end sm:self-auto mt-1" />
                    </label>
                  </div>
                </div>

                {/* Secure Gateway logo message styled exactly like the salmon box in the photo */}
                <div className="mt-8 p-4 rounded-xl bg-[#fff5ea] text-[#8e6141] text-xs flex items-center gap-3 border border-orange-100/50 justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#ff6900] shrink-0" />
                  <span className="font-semibold text-center md:text-left">
                    Pagos seguros procesados por Wompi / Bold
                  </span>
                </div>
              </div>

              {/* Card 3: Resumen del Pedido */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-6 border-b border-gray-100 pb-3">
                    Resumen del Pedido
                  </h3>

                  {/* Product Detail Card snippet */}
                  <div className="flex gap-4 mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80" 
                      alt="Mi 20W Wireless Car Charger" 
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">Mi 20W Wireless Car Charger</h4>
                        <p className="text-xs text-gray-400 mt-1">Soporte Automático con Sensor</p>
                      </div>
                      
                      {/* Quantity state control inside Summary */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded hover:bg-gray-100 text-xs font-bold leading-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded hover:bg-gray-100 text-xs font-bold leading-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          $ {BASE_PRICE.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Grid */}
                  <div className="space-y-3.5 border-t border-gray-100 pt-6 text-sm">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold">$ {totalPrice.toLocaleString("es-CO")}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>Envío</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        ENVÍO GRATIS
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col justify-between gap-1.5">
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total a pagar</span>
                      <span className="text-[32px] font-black text-[#ff6900] tracking-tight leading-none">
                        $ {totalPrice.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>

                  {/* Security Indicators row */}
                  <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-6 mt-6 pb-6">
                    <div className="flex flex-col items-center text-center p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
                      <span className="text-[10px] text-gray-500 font-bold leading-none uppercase">Pago 100%</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Seguro</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <ShieldCheck className="w-5 h-5 text-amber-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-bold leading-none uppercase">Distribuidor</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Autorizado</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* CTA Orange button exactly like screenshot PAGAR AHORA */}
                  <button
                    type="submit"
                    className="w-full bg-[#ff6900] hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-extrabold text-sm tracking-wide uppercase transition-all duration-150 cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {paymentOption === "WHATSAPP" ? "COMPLETAR POR WHATSAPP" : "PAGAR AHORA"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-gray-400 font-semibold text-center mt-3">
                    🛡️ Garantía Oficial de Xiaomi CarTech Colombia
                  </p>
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
