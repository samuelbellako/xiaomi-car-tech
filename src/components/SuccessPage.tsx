import React from "react";
import { 
  CheckCircle, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Copy, 
  Check, 
  TrendingUp, 
  Printer, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { Order } from "../types";

interface SuccessPageProps {
  order: Order;
  emailNotificationSent: boolean;
  onReset: () => void;
}

export default function SuccessPage({ order, emailNotificationSent, onReset }: SuccessPageProps) {
  const [copied, setCopied] = React.useState(false);

  const formattedTotal = order.amount.toLocaleString("es-CO");

  // Compile colombian WhatsApp backup message with correct formatting
  const formattedWhatsappMsg = `Hola Xiaomi CarTech! Acabo de completar el pedido para mi Mi 20W Wireless Car Charger 🚗⚡ en xiaomicartech.com.co.
*ID de Orden:* #${order.id}
*Cliente:* ${order.customerName}
*Dirección:* ${order.customerAddress}, ${order.customerCity}
*Teléfono:* ${order.customerPhone}
*Método de Pago:* ${order.paymentMethod}
*Total:* $${formattedTotal} COP

Por favor me confirman disponibilidad de envío inmediato!`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      
      {/* Visual Header Success indicator */}
      <div className="text-center flex flex-col items-center gap-4 mb-10">
        <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center shadow-lg border border-green-100">
          <CheckCircle className="w-12 h-12 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-bold text-green-600 bg-green-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
            Transacción Registrada con Éxito
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">¡Gracias por tu compra!</h2>
          <p className="text-gray-500 font-medium text-sm mt-1.5 max-w-md mx-auto">
            Hemos guardado los detalles de tu orden. Tu despacho se procesará de forma prioritaria una vez el comercio valide el abono en el administrador.
          </p>
        </div>
      </div>

      {/* Main Grid: Details + WhatsApp Converter box */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Lefhand order summary cards */}
        <div className="md:col-span-3 space-y-6 text-left">
          
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Número de Pedido</span>
              <button 
                onClick={handleCopyId}
                className="flex items-center gap-1.5 text-xs text-[#ff6900] hover:underline font-bold focus:outline-none"
                id="copy-order-id-btn"
              >
                <span>#{order.id}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-gray-400 font-semibold uppercase block">Método de Pago</span>
                <span className="text-sm font-extrabold text-gray-900 uppercase block mt-0.5">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-semibold uppercase block">Total Abonado</span>
                <span className="text-sm font-extrabold text-[#ff6900] block mt-0.5">${formattedTotal} COP</span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] text-gray-400 font-semibold uppercase block">Estado del Despacho</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/50 py-1 px-2.5 rounded-lg inline-block mt-1">
                  PENDIENTE (Validando Gateway)
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Coordinates */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
            <h4 className="font-extrabold text-gray-900 text-sm mb-3.5 border-b border-gray-100 pb-2">Coordenadas de Despacho</h4>
            
            <div className="space-y-3 font-normal text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong className="text-gray-800">Dirección:</strong> {order.customerAddress}, {order.customerCity}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong className="text-gray-800">Correo:</strong> {order.customerEmail}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong className="text-gray-800">Destinatario:</strong> {order.customerName} ({order.customerPhone})
                </p>
              </div>
            </div>
          </div>

          {/* Electronic Mail Delivery Status Message */}
          <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#ff6900] shrink-0 mt-0.5" />
            <div className="text-xs text-orange-950 font-normal leading-relaxed">
              <h5 className="font-bold text-gray-900 mb-0.5">Notificación de Compra Detallada</h5>
              {emailNotificationSent ? (
                <p>
                  ¡Enviamos con éxito el correo electrónico con el resumen detallado de la orden a tu buzón <strong>{order.customerEmail}</strong> a través de Resend! Adicionalmente, se remitió una alerta administrativa del pedido al comercio.
                </p>
              ) : (
                <p>
                  La orden se grabó con éxito en nuestro sistema local. (El despachador de correos de Resend se encuentra corriendo en modo de simulación. Se registraron los logs correspondientes en el servidor).
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Righhand backup WhatsApp action card */}
        <div className="md:col-span-2 space-y-6 text-left">
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100/10 border border-green-200 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col justify-between h-full shadow-sm text-left">
            <div>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 tracking-wider px-2 py-1 rounded-md uppercase inline-block">
                COMPRA SEGURA RESPALDADA
              </span>
              <h4 className="text-xl font-extrabold text-gray-900 mt-3 leading-tight">Relacionar Pedido por WhatsApp</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                ¡Maximiza la velocidad de tu despacho! Respaldamos todas nuestras ventas con chat directo. Presiona el botón verde de abajo para redirigirte a nuestro chat y notificar a un agente humano en tiempo real.
              </p>

              <div className="bg-white border border-green-200/60 rounded-2xl p-4 mt-4 text-xs font-mono text-gray-500 overflow-hidden line-clamp-3">
                {formattedWhatsappMsg}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-green-200">
              <a 
                href={`https://wa.me/573000000000?text=${encodeURIComponent(formattedWhatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-center"
                id="whatsapp-completion-btn"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Completar Compra por WhatsApp
              </a>
              <span className="text-[9px] text-gray-400 font-medium text-center block mt-2">
                Aplica para envíos inmediatos en Bogotá, Medellín y Cali.
              </span>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button 
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm py-3 px-8 rounded-xl transition flex items-center gap-2 cursor-pointer"
          id="continue-shopping-btn"
        >
          <ShoppingBag className="w-4 h-4" />
          Volver a la Tienda
        </button>
      </div>

    </div>
  );
}
