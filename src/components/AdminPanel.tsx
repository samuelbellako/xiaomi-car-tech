import React from "react";
import { 
  Users, 
  User,
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Key,
  ShieldAlert,
  SlidersHorizontal,
  DollarSign
} from "lucide-react";
import { Order } from "../types";

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: 'APPROVED' | 'DECLINED' | 'PENDING') => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onRefreshOrders: () => void;
}

export default function AdminPanel({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onRefreshOrders
}: AdminPanelProps) {
  // Authentication states
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [isLogged, setIsLogged] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  
  // Google Auth Simulation states
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = React.useState(false);
  const [googleEmailField, setGoogleEmailField] = React.useState("");
  const [googleStep, setGoogleStep] = React.useState<"CHOOSE_ACCOUNT" | "ENTER_EMAIL" | "VERIFYING">("CHOOSE_ACCOUNT");
  const [googleError, setGoogleError] = React.useState("");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = React.useState<string>("ALL");
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);

  // Auto-filled login helper for swift demonstration
  const handlePrefillEmail = () => {
    setEmailInput("cic.inmuebles@gmail.com");
    setPasswordInput("admin1234");
    setAuthError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() !== "cic.inmuebles@gmail.com") {
      setAuthError("Email no autorizado. Acceso restringido únicamente a cic.inmuebles@gmail.com.");
      return;
    }
    setAuthError("");
    setIsLogged(true);
  };

  const handleGoogleSelectAccount = async (email: string) => {
    setGoogleError("");
    setGoogleStep("VERIFYING");
    setGoogleAuthLoading(true);
    
    // Simulate real Google verification latency (1.2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setGoogleAuthLoading(false);
    if (email.trim().toLowerCase() === "cic.inmuebles@gmail.com") {
      setEmailInput("cic.inmuebles@gmail.com");
      setIsLogged(true);
      setShowGoogleModal(false);
      setAuthError("");
    } else {
      setGoogleStep("CHOOSE_ACCOUNT");
      setGoogleError(`El correo ${email} no tiene permisos de Administrador en este portal.`);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailField.trim() || !googleEmailField.includes("@")) {
      setGoogleError("Por favor, introduce una dirección de correo válida.");
      return;
    }
    handleGoogleSelectAccount(googleEmailField);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setEmailInput("");
    setPasswordInput("");
    setGoogleEmailField("");
    setGoogleStep("CHOOSE_ACCOUNT");
  };

  // Perform statistics calculations over loaded orders
  const totalSalesCount = orders.length;
  const approvedSales = orders.filter(o => o.status === "APPROVED");
  const totalApprovedEarnings = approvedSales.reduce((acc, sum) => acc + sum.amount, 0);
  
  const pendingSalesCount = orders.filter(o => o.status === "PENDING").length;
  const declinedSalesCount = orders.filter(o => o.status === "DECLINED").length;

  const totalPossibleEarnings = orders.reduce((acc, sum) => acc + sum.amount, 0);

  // Filter application pipeline
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCity.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || order.paymentMethod.toUpperCase() === paymentFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Login UI Panel Wrapper
  if (!isLogged) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 relative">
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-xl text-left">
          
          <div className="text-center mb-6">
            <span className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff6900] mx-auto mb-3 border border-orange-100/30">
              <Lock className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight">Consola Administrativa de Ventas</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[280px] mx-auto">
              Acceso seguro restringido únicamente para: <strong className="text-gray-700 font-bold block mt-1">cic.inmuebles@gmail.com</strong>
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2 mb-5 font-semibold border border-red-100 leading-snug">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON (PRIMARY REQUESTED METHOD) */}
          <div className="mb-6">
            <button
              onClick={() => {
                setGoogleError("");
                setGoogleStep("CHOOSE_ACCOUNT");
                setShowGoogleModal(true);
              }}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm py-3.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all cursor-pointer active:scale-[0.98] duration-100"
              id="google-signin-btn"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" width="20px" height="20px">
                <path
                  fill="#EA4335"
                  d="M20.64 12.25c0-.63-.06-1.25-.16-1.85H12v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.78 2.16c1.63-1.5 2.57-3.71 2.57-6.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.78-2.16c-.77.52-1.75.83-2.96.83-2.28 0-4.21-1.54-4.9-3.61l-2.87 2.22C8.93 18.91 10.34 21 12 21z"
                />
                <path
                  fill="#34A853"
                  d="M7.1 13.88c-.17-.52-.27-1.07-.27-1.63s.1-1.11.27-1.63l-2.87-2.22C3.47 10.05 3 11.02 3 12s.47 1.95 1.23 3.61l2.87-2.22z"
                />
                <path
                  fill="#4285F4"
                  d="M12 6.51c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.9 14.43 3 12 3 10.34 3 8.93 5.09 7.46 6.16l2.87 2.22c.69-2.07 2.62-3.61 4.9-3.61z"
                />
              </svg>
              <span>Iniciar Sesión con Google</span>
            </button>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">o código de acceso</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setAuthError(""); }}
                  placeholder="ejemplo@correo.com" 
                  className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Clave de Seguridad</label>
              <div className="relative">
                <input 
                  type="password" 
                  required 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full text-sm border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <Key className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#ff6900] hover:bg-orange-700 font-extrabold text-sm py-3.5 rounded-xl mt-2 transition cursor-pointer"
              id="admin-login-submit"
            >
              Verificar Credenciales
            </button>
          </form>

          {/* Quick-fill button to accelerate demonstration flow */}
          <div className="border-t border-gray-100 pt-5 mt-5 text-center">
            <span className="text-[10px] text-gray-400 block font-semibold uppercase mb-2">Acceso de Demostración</span>
            <button
              onClick={handlePrefillEmail}
              className="text-xs font-bold text-[#ff6900] bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl transition hover:bg-orange-100 text-center mx-auto cursor-pointer"
              id="admin-prefill-btn"
            >
              Autocompletar Prueba
            </button>
          </div>

        </div>

        {/* HIGH-FIDELITY SIMULATED GOOGLE AUTH POPUP MODAL */}
        {showGoogleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-gray-100 p-6 text-left relative">
              
              {/* Google Brand Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <svg className="h-8" viewBox="0 0 24 24" width="32" height="32">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.4 2.64c1.99-1.83 3.45-4.53 3.45-7.96z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.4-2.64c-.95.63-2.16 1.01-3.88 1.01-2.99 0-5.52-2.02-6.42-4.74L2.01 16.4C3.84 20.3 7.85 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.58 14.12A7.17 7.17 0 015.17 12c0-.74.13-1.46.36-2.13L2.01 7.25C1.19 8.88 1 10.45 1 12s.19 3.12.91 4.75l3.67-2.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.85 1 3.84 3.7 2.01 7.6l3.57 2.77c.9-2.72 3.43-4.99 6.42-4.99z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Iniciar sesión con Google</h4>
                <p className="text-xs text-gray-400 mt-1">
                  para continuar a <strong className="text-gray-700">Xiaomi CarTech</strong>
                </p>
              </div>

              {googleError && (
                <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex flex-col gap-1 mb-4 border border-red-100 leading-normal font-medium">
                  <span><strong>Error de Google Auth:</strong></span>
                  <span>{googleError}</span>
                </div>
              )}

              {googleStep === "CHOOSE_ACCOUNT" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-500 block mb-2 uppercase tracking-wide">Selecciona una cuenta:</span>
                  
                  {/* Option 1: Authorized Email (requested) */}
                  <button
                    onClick={() => handleGoogleSelectAccount("cic.inmuebles@gmail.com")}
                    type="button"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-orange-100 bg-orange-50/20 hover:bg-orange-50 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ff6900] text-white font-extrabold text-sm flex items-center justify-center">
                        C
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-black text-gray-900 block">cic.inmuebles@gmail.com</span>
                        <span className="text-[10px] text-[#ff6900] font-bold">Administrador Principal</span>
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></div>
                  </button>

                  {/* Option 2: Unauthorized Account Demo */}
                  <button
                    onClick={() => handleGoogleSelectAccount("visitante.prueba@gmail.com")}
                    type="button"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-500 text-white font-extrabold text-sm flex items-center justify-center">
                        V
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-gray-900 block">visitante.prueba@gmail.com</span>
                        <span className="text-[10px] text-gray-400">Cuenta de Invitado</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Use other account custom input */}
                  <button
                    onClick={() => setGoogleStep("ENTER_EMAIL")}
                    type="button"
                    className="w-full text-center py-2.5 text-xs font-bold text-[#ff6900] hover:text-orange-700 transition cursor-pointer mt-2 block"
                  >
                    Usar otra cuenta de Google
                  </button>

                  <div className="border-t border-gray-100 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(false)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {googleStep === "ENTER_EMAIL" && (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Correo o teléfono de Google</label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@gmail.com"
                      value={googleEmailField}
                      onChange={(e) => { setGoogleEmailField(e.target.value); setGoogleError(""); }}
                      className="w-full text-sm border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 leading-normal">
                    Para continuar, Google compartirá tu nombre, dirección de correo electrónico, foto de perfil y el idioma de preferencia con Xiaomi CarTech.
                  </p>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setGoogleStep("CHOOSE_ACCOUNT")}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2b72e5] hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                </form>
              )}

              {googleStep === "VERIFYING" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-4 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500 rounded-full animate-spin"></div>
                  <h5 className="text-sm font-bold text-gray-900 mt-6">Verificando cuenta...</h5>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Cargando servicios de autenticación de Google y perfiles.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  }

  // Loaded Console UI
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in-up">
      
      {/* Upper bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold bg-[#ff6900]/10 text-[#ff6900] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Consola Operativa Oficial
          </span>
          <h2 className="text-3xl font-extrabold text-gray-950 mt-1.5">Registro Técnico de Ventas</h2>
          <p className="text-xs text-gray-500 mt-1">
            Monitorea transacciones seguras registradas por pasarela y autoriza despachos. Sesión activa: <strong className="text-gray-800">{emailInput}</strong>
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onRefreshOrders}
            className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm transition flex items-center gap-1.5"
            id="refresh-grid-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar Grilla
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2.5 px-4 rounded-xl transition border border-red-100"
            id="admin-logout-btn"
          >
            Salir Consola
          </button>
        </div>
      </div>

      {/* Metrics Dashboards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ingresos Aprobados</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              $ {totalApprovedEarnings.toLocaleString("es-CO")} Cop
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              De $ {totalPossibleEarnings.toLocaleString("es-CO")} posibles
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Despachos Aptos</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              {approvedSales.length} Pedidos
            </span>
            <span className="text-[10px] text-green-600 font-semibold block mt-0.5">
              Pagos aprobados
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Validación Pendiente</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              {pendingSalesCount} Pedidos
            </span>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
              Revisar pasarelas
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Compras Declinadas</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              {declinedSalesCount} Pedidos
            </span>
            <span className="text-[10px] text-red-500 font-semibold block mt-0.5">
              Fondos insuficientes/Cancelado
            </span>
          </div>
        </div>

      </div>

      {/* Filter and query controls toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <input 
            type="text" 
            placeholder="Buscar por ID de pedido, cliente, ciudad..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Sliders selectors */}
        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 rounded-xl border border-gray-200">
            <span className="text-[10px] text-gray-400 font-extrabold px-1.5">ESTADO:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-transparent py-2 px-1 rounded-md focus:outline-none font-semibold text-gray-700"
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobado</option>
              <option value="DECLINED">Rechazado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-2 rounded-xl border border-gray-200">
            <span className="text-[10px] text-gray-400 font-extrabold px-1.5">PASARELA / DETALLES:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs bg-transparent py-2 px-1 rounded-md focus:outline-none font-semibold text-gray-700"
            >
              <option value="ALL">Todas las formas</option>
              <option value="WOMPI">Wompi</option>
              <option value="BOLD">Bold Colombia</option>
              <option value="EFIPAY">Efipay</option>
              <option value="PSE">PSE / Nequi</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid of tabular records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="font-medium text-sm">No se encontraron ventas con los filtros actuales.</p>
            <p className="text-xs block mt-1">Prueba a escribir términos de búsqueda más genéricos.</p>
          </div>
        ) : (
          <React.Fragment>
            {/* Desktop Table: Hidden on Mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Pedido ID</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Ciudad</th>
                  <th className="p-4">Medio de Pago</th>
                  <th className="p-4">Monto ($ COP)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="border-b border-gray-50 hover:bg-gray-50/55 transition duration-150">
                        <td className="p-4 font-mono font-bold text-amber-700">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="text-left hover:underline focus:outline-none cursor-pointer"
                            style={{ color: '#ff6900' }}
                          >
                            #{order.id}
                          </button>
                        </td>
                        <td className="p-4 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("es-CO")}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-800">{order.customerName}</div>
                          <div className="text-[10px] text-gray-400 leading-none mt-0.5">{order.customerEmail}</div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          {order.customerCity}
                        </td>
                        <td className="p-4 font-bold text-gray-700">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wide ${
                            order.paymentMethod === 'Wompi' ? 'bg-indigo-50 text-indigo-700' :
                            order.paymentMethod === 'Bold' ? 'bg-purple-50 text-purple-700' :
                            order.paymentMethod === 'Efipay' ? 'bg-sky-50 text-sky-700' :
                            order.paymentMethod === 'PSE' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-[#ff6900]">
                          $ {order.amount.toLocaleString("es-CO")}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' :
                            order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {order.status === 'APPROVED' ? 'Aprobado' :
                             order.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </td>
                        
                        {/* Status Change Quick buttons */}
                        <td className="p-4 flex gap-1.5 justify-center">
                          {order.status !== 'APPROVED' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'APPROVED')}
                              className="bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition"
                              title="Aprobar Pago"
                            >
                              ✓ Apto
                            </button>
                          )}
                          {order.status !== 'DECLINED' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'DECLINED')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition"
                              title="Declinar Pago"
                            >
                              ✗ Declin
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-55 transition cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable client details overlay */}
                      {isExpanded && (
                        <tr className="bg-gray-50/50 border-b border-gray-100 font-normal">
                          <td colSpan={8} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                              
                              <div className="space-y-2">
                                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">Detalle de Envío Completo</h5>
                                <div className="space-y-1 text-gray-600 font-medium font-sans">
                                  <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-gray-400 font-bold" /> <strong>Nombre:</strong> {order.customerName}</p>
                                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <strong>Dirección:</strong> {order.customerAddress}, {order.customerCity}</p>
                                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <strong>Celular principal:</strong> {order.customerPhone}</p>
                                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> <strong>Correo:</strong> {order.customerEmail}</p>
                                </div>
                              </div>

                              <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 max-w-full overflow-hidden">
                                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">Información de Pasarela y Transacción</h5>
                                <div className="space-y-1.5 text-gray-600 font-medium">
                                  <p><strong>ID Transacción:</strong> <span className="font-mono bg-white border border-gray-200 py-0.5 px-2 rounded-md font-bold text-gray-700">{order.paymentDetails?.transactionId || 'N/A'}</span></p>
                                  <p><strong>Detalle de pasarela:</strong> {order.paymentDetails?.extraMessage || 'No se registraron notas adicionales.'}</p>
                                  <p>
                                    <strong>Artículos comprados:</strong>{" "}
                                    {order.items?.map((it, i) => `${it.name} (x${it.quantity})`).join(", ")}
                                  </p>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Bento Card List: Visible on Mobile, Hidden on Desktop */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              
              return (
                <div key={order.id} className="p-4 space-y-4 hover:bg-gray-50/40 transition">
                  {/* Row 1: Order ID with click toggle and status badge */}
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="font-mono font-black text-[#ff6900] hover:underline text-sm focus:outline-none cursor-pointer"
                    >
                      #{order.id}
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      order.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' :
                      order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {order.status === 'APPROVED' ? 'Aprobado' :
                       order.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </div>

                  {/* Row 2: Customer basic info */}
                  <div className="text-xs space-y-1">
                    <p className="font-black text-gray-950 text-sm leading-tight">{order.customerName}</p>
                    <p className="text-gray-400 font-semibold">{order.customerEmail}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium pt-1">
                      <span>{new Date(order.createdAt).toLocaleDateString("es-CO")}</span>
                      <span>{order.customerCity}</span>
                    </div>
                  </div>

                  {/* Row 3: Payment method badge & amount */}
                  <div className="flex justify-between items-center py-2 border-t border-b border-gray-50 bg-gray-50/30 px-2 rounded-lg">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider font-bold ${
                      order.paymentMethod === 'Wompi' ? 'bg-indigo-50 text-indigo-700' :
                      order.paymentMethod === 'Bold' ? 'bg-purple-50 text-purple-700' :
                      order.paymentMethod === 'Efipay' ? 'bg-sky-50 text-sky-700' :
                      order.paymentMethod === 'PSE' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {order.paymentMethod}
                    </span>
                    <span className="font-black text-[#ff6900] text-sm">
                      $ {order.amount.toLocaleString("es-CO")} COP
                    </span>
                  </div>

                  {/* Row 4: Call to action status modification buttons (Min 44px vertical height) */}
                  <div className="grid grid-cols-3 gap-2">
                    {order.status !== 'APPROVED' ? (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'APPROVED')}
                        className="bg-green-50 active:bg-green-100 text-green-700 py-3 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase transition cursor-pointer text-center"
                      >
                        ✓ Apto
                      </button>
                    ) : (
                      <span className="bg-green-50/30 text-green-500 py-3 rounded-xl text-[10px] font-black block text-center border border-green-100/50">
                        ✓ Aprobado
                      </span>
                    )}

                    {order.status !== 'DECLINED' ? (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'DECLINED')}
                        className="bg-red-50 active:bg-red-100 text-red-700 py-3 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase transition cursor-pointer text-center"
                      >
                        ✗ Rechazo
                      </button>
                    ) : (
                      <span className="bg-red-50/30 text-red-400 py-3 rounded-xl text-[10px] font-black block text-center border border-red-100/30">
                        ✗ Rechazado
                      </span>
                    )}

                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="bg-gray-50 hover:bg-red-50 hover:text-red-700 text-gray-500 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 border border-gray-100"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      Borrar
                    </button>
                  </div>

                  {/* Row 5: Collapse/expand additional coordinates button */}
                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="w-full text-center text-[9px] font-black text-gray-400 uppercase tracking-widest pt-1 block cursor-pointer focus:outline-none"
                  >
                    {isExpanded ? "▲ CONTRAER DATOS" : "▼ DETALLES DE DESPACHO"}
                  </button>

                  {/* Expanded Block for Dispatch details */}
                  {isExpanded && (
                    <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3.5 text-xs text-left border border-slate-100">
                      <div className="space-y-1 text-gray-600 font-sans">
                        <h5 className="font-extrabold text-gray-900 uppercase tracking-wider text-[9px] mb-1.5 pb-0.5 border-b border-gray-100">Destinatario y Envío</h5>
                        <p><strong className="text-gray-700">Nombre:</strong> {order.customerName}</p>
                        <p><strong className="text-gray-750">Dirección:</strong> {order.customerAddress}, {order.customerCity}</p>
                        <p><strong className="text-gray-700">Celular:</strong> {order.customerPhone}</p>
                        <p><strong className="text-gray-700">Email:</strong> {order.customerEmail}</p>
                      </div>
                      
                      <div className="space-y-1 pt-2 border-t border-gray-200/50 text-gray-600">
                        <h5 className="font-extrabold text-gray-900 uppercase tracking-wider text-[9px] mb-1.5 pb-0.5 border-b border-gray-100">Pasarela Transaccional</h5>
                        <p><strong>Cód Transacción:</strong> <span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[11px] font-bold text-gray-700">{order.paymentDetails?.transactionId || 'N/A'}</span></p>
                        <p className="break-words"><strong>Comentarios:</strong> {order.paymentDetails?.extraMessage || 'Sin notas.'}</p>
                        <p><strong>Artículos:</strong> {order.items?.map((it) => `${it.name} (x${it.quantity})`).join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>

    </div>
  );
}
