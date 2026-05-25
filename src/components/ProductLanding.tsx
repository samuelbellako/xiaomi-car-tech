import React from "react";
import { 
  Award, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  Star, 
  Tv, 
  Cpu, 
  Timer, 
  Truck, 
  Users, 
  Maximize2, 
  Video, 
  Compass, 
  CheckCircle2, 
  HelpCircle,
  Smartphone
} from "lucide-react";

interface ProductLandingProps {
  onOpenCheckout: () => void;
}

export default function ProductLanding({ onOpenCheckout }: ProductLandingProps) {
  const [activeTab, setActiveTab] = React.useState<"features" | "specs" | "reviews">("features");
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  // High Resolution Product Image Assets
  const HERO_IMAGE = "https://lh3.googleusercontent.com/aida/ADBb0ugMDvuzjpi3HIXxJrkGmGH0yOZXKap1sVi-O5EWkbRB0XOWalN3MUnHfejxtzZYjTws_ihmgHo8IAP9X7tfeaM8d50nJBUYo7mKHF148tVXvC0tFSic3tw-ysCSYbMuAZZwfzjBUHqftbpqYOElDTvyLFt0R3zgrWnga0bc-7l4CVnYc92kPf2-SWVhWaJW5c_BSTFoVIdh95hQwz0URRUkmfXV9QckzC8m4J6Wgj7-U4OWb8884CIUzfCx";
  const SENSOR_IMAGE = "https://lh3.googleusercontent.com/aida/ADBb0uiPN0GOVRt1aAPWM6jrJQfPuA5Hus4JLMz-wlXN49T945FiiJuWyCZVC69tQbMlebgA64BLAshhdF96wB3IvXW-OW8QYqbwo90S9k9is4Kb8oKA9G_QV85H_6599WZsdxBojczUk1xVhW86jxagUuuMdh6RFgQobEBRGU0JEwRlfKovwb24Dha3Y9br8m47emaZN7fuEiMVAH7tPtqE95iH164bKTDy-8Gp6pFakDK773u_f7CXBAJRJCBM";
  
  // Secondary mounting images
  const MOUNT_STYLISH = "https://lh3.googleusercontent.com/aida-public/AB6AXuDb4tCIFKq4rJ1NAc4KY3AWQupIYxvPvzbo2ou8Qs9SISyT_OpBQR_dV0Bxu6VOXnbXmVKNuKlTHWIt97tzsiI0FdGKiUA7nrOioGZ5D0QsIDBnt4Sta1EkXrXylIDfOtgsaRl5RRbiBO1WnueWMi3okedfpcpVxUuBclVXr0j72KU939Mvv8FcE4gMfIXKkTgVAfS0F1n7T0xFRyYRChGGK4Y4cIRqoe_H-QRYojjGXJlhpAfvP49lr8rEui2QpnfepFcGBNTiGD8q";
  const SEC_MOUNT = "https://lh3.googleusercontent.com/aida-public/AB6AXuDg0HLk0eGSwLD-wc4mZm10E3USrVDH3KyEAImvUPvG9wvf6iUfrdsZbtMl_rf4c9X0rBBD2tunap6miExDRDrBjgdaXODEgZXRtjtHkDzDoy3f0OjUHfmJivQLQrwjdVnBHha9R97loxnUnNGS3MfLjRCYWcrndS2_Zjx22ft3HovIQXMOulgApcV-i-DGq3lUWNFIG-yF3mwcVGf_FYOoQNOalPXeNZ8D1_DiWfqSZ9HY74OY5BWPNbFYop9ex1Jp4E0Ymo_FdbLp";

  return (
    <div className="bg-white">
      
      {/* SECTION: Hero & Main product spotlight */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-gray-100 bg-gradient-to-b from-orange-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Main Visuals with clean overlay indicators */}
          <div className="relative order-1 lg:order-2 flex flex-col items-center justify-center gap-5">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm border border-gray-100 px-4 py-2 rounded-2xl shadow-sm text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Xiaomi Certificado Oficial</span>
              </div>
              <img 
                src={HERO_IMAGE} 
                alt="Xiaomi Mi 20W Wireless Car Charger mount high-res shot" 
                className="w-full h-auto object-cover rounded-3xl shadow-xl border border-gray-100 transition-transform hover:scale-[1.01] duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 hidden lg:flex flex-col items-center justify-center w-28 h-28 bg-amber-600 rounded-full text-white shadow-xl animate-bounce" style={{ backgroundColor: '#ff6900' }}>
                <span className="text-xs font-bold uppercase tracking-wider block">Carga</span>
                <span className="text-3xl font-black block leading-none">20W</span>
                <span className="text-[10px] opacity-90 block uppercase leading-none mt-1">SÚPER RÁPIDA</span>
              </div>
            </div>

            {/* NEW IMMEDIATE BUY NOW BUTTON FOR MAXIMUM VISIBILITY */}
            <div className="w-full max-w-lg lg:max-w-none mt-1">
              <button
                onClick={onOpenCheckout}
                className="w-full py-4 px-6 rounded-2xl text-white font-black uppercase text-sm tracking-widest shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
                style={{ background: 'linear-gradient(90deg, #ff6900 0%, #ff8b3d 100%)' }}
                id="hero-image-immediate-buy-btn"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
                <span>COMPRAR AHORA CON ENVÍO GRATIS</span>
                <span className="bg-white/20 text-[10px] py-1 px-2.5 rounded-full font-bold ml-1">
                  ORDENAR
                </span>
              </button>
            </div>
          </div>

          {/* Copywriting information block */}
          <div className="order-2 lg:order-1 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/50 px-3 py-1.5 rounded-full w-fit">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest leading-none">Oferta Aliado Directo Colombia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
              Mi 20W Wireless<br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500" style={{ color: '#ff6900' }}>Car Charger</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
              Olvídate de conectar cables mientras conduces. Experimenta la comodidad de la carga rápida inalámbrica de hasta 20W con apertura automática por sensor infrarrojo integrado y un cooler de disipación activa.
            </p>

            {/* Purchase Converter Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md">
              <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-5 mb-5 text-left">
                <span className="text-xs font-bold uppercase text-red-600 bg-red-50 w-fit px-2.5 py-1 rounded-md tracking-widest">
                  🔥 DESCUENTOS DE TEMPORADA
                </span>
                <div className="flex items-baseline gap-3.5 mt-2">
                  <span className="text-4xl font-extrabold text-amber-600" style={{ color: '#ff6900' }}>
                    $179.900 COP
                  </span>
                  <span className="text-base text-gray-400 line-through font-semibold">
                    $219.900 COP
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  ¡Ahorras $40.000 COP de forma inmediata!
                </p>
              </div>

              {/* Secure parameters indicators */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-2xl flex items-center gap-2">
                  <Timer className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-700 leading-tight">Oferta por hoy</span>
                </div>
                <div className="bg-green-50/50 border border-green-100 p-3 rounded-2xl flex items-center gap-2">
                  <Truck className="w-4.5 h-4.5 text-green-600 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-700 leading-tight">Envío Gratis País</span>
                </div>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                style={{ backgroundColor: '#ff6900' }}
                id="hero-buy-now-btn"
              >
                Comprar Ahora – Envío Gratis
              </button>
              
              <p className="text-[11px] text-gray-400 font-medium text-center mt-3">
                🔒 Paga con PSE, Nequi, Wompi, Bold o contra-entrega asistida por WhatsApp.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: Features section - Infrared Automatic Mount */}
      <section className="py-16 md:py-24 bg-gray-50/50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 lg:order-1">
            <img 
              src={SENSOR_IMAGE} 
              alt="Close-up of Xiaomi Intelligent Infrared Sensor on vent mount" 
              className="w-full h-auto object-cover rounded-3xl shadow-lg border border-gray-100"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-6 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Sensor Infrarrojo Inteligente con Sujeción Automatizada
            </h2>
            <p className="text-gray-600 text-base leading-relaxed font-normal">
              El cargador cuenta con un sensor infrarrojo oculto que detecta automáticamente tu teléfono cuando lo acercas a menos de 8 centímetros. Al censarlo, los brazos motorizados laterales de sujeción se abren suavemente de forma autónoma y se cierran firmemente en un instante.
            </p>
            <p className="text-gray-600 text-base leading-relaxed font-normal">
              Retirar el dispositivo es igual de rápido y cómodo: un simple toque con el dedo en el sensor metálico lateral de liberación activa el sistema neumático trasero, liberando tu teléfono al instante con total seguridad con una sola mano.
            </p>

            <div className="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">Operación con una mano</h4>
                <p className="text-xs text-gray-500 mt-1">Saca tu celular en un segundo presionando el gatillo lateral.</p>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">Cristal Curvo 2.5D</h4>
                <p className="text-xs text-gray-500 mt-1">Panel de vidrio premium que mejora la refrigeración térmica táctil.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: 20W Súper Charge block */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-6 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Carga Inalámbrica de 20W Súper Rápida en el Camino
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Disfruta de la inmediatez de la carga rápida en tus trayectos diarios. Este cargador entrega una potencia eléctrica de hasta 20W capaz de resucitar la batería del teléfono compatible de un 0% a un 45% en solo 30 minutos de manejo.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              Equipado con un doble mecanismo de protección térmica (un pequeño ventilador extractor interno silencioso y un disipador metálico trasero de cobre), el cargador balancea la salida de potencia según la temperatura ambiental de la rejilla. Esto previene recalentamientos severos en el teléfono y cuida el rendimiento de la batería a largo plazo.
            </p>
            <button
              onClick={onOpenCheckout}
              className="text-amber-600 font-bold hover:text-amber-700 transition-colors flex items-center gap-1 text-sm mt-1"
              style={{ color: '#ff6900' }}
              id="features-link-btn"
            >
              Comprar Cargador con Garantía Original &rarr;
            </button>
          </div>

          <div className="bg-gradient-to-tr from-amber-50 to-orange-50/50 p-8 rounded-3xl border border-amber-100 flex flex-col items-center justify-center text-center min-h-[300px] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4 text-amber-600" style={{ color: '#ff6900' }}>
              <Zap className="w-8 h-8 fill-amber-500" />
            </div>
            <span className="text-6xl font-black text-gray-900 tracking-tight">20W</span>
            <span className="text-sm font-bold uppercase tracking-widest text-[#ff6900] mt-1">Potencia Máxima de Salida</span>
            <p className="text-xs text-gray-500 max-w-xs mt-3 leading-relaxed">
              Compatible con todos los celulares del mercado con certificación Qi (Apple, Xiaomi, Samsung, Huawei, etc).
            </p>
          </div>

        </div>
      </section>

      {/* SECTION: Gallery & Video */}
      <section className="py-16 md:py-24 bg-gray-50" id="specs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Galería de Rendimiento en Ruta</h2>
            <p className="text-gray-500 text-sm mt-3 font-semibold uppercase tracking-wider">Fotografías Oficiales de Xiaomi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="flex flex-col gap-6">
              <img 
                src={MOUNT_STYLISH} 
                alt="Mounting the Xiaomi Car Charger on car panel" 
                className="w-full h-80 object-cover rounded-3xl shadow-md border border-white"
                referrerPolicy="no-referrer"
              />
              <div className="grid grid-cols-2 gap-6">
                <img 
                  src={HERO_IMAGE} 
                  alt="Car charger front perspective" 
                  className="w-full h-48 object-cover rounded-3xl shadow-md border border-white"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src={SENSOR_IMAGE} 
                  alt="Vent secure clip mechanism details" 
                  className="w-full h-48 object-cover rounded-3xl shadow-md border border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div>
              <img 
                src={SEC_MOUNT} 
                alt="Car charger vent ventilation perspective elegant portrait" 
                className="w-full h-[560px] object-cover rounded-3xl shadow-md border border-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Video Player Segment */}
          <div className="mt-16 bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Demostración en Vivo</h3>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900 flex flex-col justify-center items-center group">
              {videoPlaying ? (
                <div className="absolute inset-0 bg-gray-900 flex justify-center items-center text-white">
                  <div className="text-center p-6">
                    <Smartphone className="w-12 h-12 text-amber-500 animate-pulse mx-auto mb-3" />
                    <p className="font-bold text-lg">Sensor Automático Activado</p>
                    <p className="text-xs text-gray-400 mt-1">Gabinete eléctrico automático: de 0 a 45%🔋 en 30 minutos.</p>
                    <button 
                      onClick={() => setVideoPlaying(false)}
                      className="mt-4 bg-gray-800 text-xs font-semibold hover:bg-gray-700 px-4 py-2 rounded-full border border-gray-700 transition"
                      id="close-video-btn"
                    >
                      Detener Demostración
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={MOUNT_STYLISH} 
                    alt="Xiaomi Wireless Car Charger demo simulation video background overlay" 
                    className="absolute inset-0 w-full h-full object-cover opacity-85 brightness-75 group-hover:scale-105 duration-700 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setVideoPlaying(true)}
                    className="absolute z-10 w-20 h-20 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg transform hover:scale-110 duration-200 cursor-pointer"
                    style={{ backgroundColor: '#ff6900' }}
                    id="play-video-btn"
                  >
                    <Star className="w-8 h-8 fill-white" />
                  </button>
                  <p className="absolute bottom-6 left-6 right-6 z-10 text-white text-xs uppercase tracking-widest bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-left font-bold">
                    ▷ Video de Demostración: Mecanismo de Clipse Automatizado por Infrarrojo
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: Specs Comparison and Technical Worksheet */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ficha Técnica Detallada</h2>
            <p className="text-gray-500 text-sm mt-2">Valores y parámetros de entrada/salida autorizados por el fabricante.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Spec Card 1 */}
            <div className="bg-gray-50 rounded-2xl p-6 text-left">
              <h3 className="font-bold text-gray-800 border-b border-gray-200/80 pb-3 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-600 rounded" style={{ backgroundColor: '#ff6900' }}></span>
                Rendimiento Eléctrico
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Entrada Máxima</td>
                    <td className="font-semibold text-gray-800 py-1.5">5V-20V - 1.35A Máximo</td>
                  </tr>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Salida Inalámbrica</td>
                    <td className="font-extrabold text-amber-600 py-1.5" style={{ color: '#ff6900' }}>20W Máximo</td>
                  </tr>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Interfaz del Puerto</td>
                    <td className="font-semibold text-gray-800 py-1.5">USB Tipo-C (Universal)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Spec Card 2 */}
            <div className="bg-gray-50 rounded-2xl p-6 text-left">
              <h3 className="font-bold text-gray-800 border-b border-gray-200/80 pb-3 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-600 rounded" style={{ backgroundColor: '#ff6900' }}></span>
                Diseño y Dimensiones
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Compatibilidad</td>
                    <td className="font-semibold text-gray-800 py-1.5 scroll-py-1">Ancho máx de celulares: 81.5mm</td>
                  </tr>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Sistema de Ajuste</td>
                    <td className="font-semibold text-gray-800 py-1.5">Rejillas o ventosa de tablero</td>
                  </tr>
                  <tr className="border-b border-gray-200/40 py-2.5 flex justify-between">
                    <td className="text-gray-500 py-1.5">Refrigeración</td>
                    <td className="font-semibold text-gray-800 py-1.5">Extractor de aire ventilador activo</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Lo que dicen nuestros clientes en Colombia</h2>
            <p className="text-gray-500 text-sm mt-2">Garantía, seriedad y alta satisfacción post-venta garantizada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Review Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "Increíble la rapidez con la que entrega la carga inalámbrica. El sistema de apertura automático funciona a la perfección, súper útil para cuando voy conduciendo haciendo entregas por la ciudad de Bogotá."
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5 mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 font-bold text-amber-700 flex items-center justify-center text-sm">
                  CM
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">Carlos M. Restrepo</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Comprador Verificado - Bogotá</p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "El mejor cargador de carro que he instalado en mi vehículo. Se ajusta firme en las rejillas del aire de mi carro y el celular no se mueve para nada, incluso al pasar por huecos. Recomendado al 100%."
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5 mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 font-bold text-orange-700 flex items-center justify-center text-sm">
                  AG
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">Andrea Gómez</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Comprador Verificado - Medellín</p>
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "Aproveché el descuento y me llegó súper rápido al siguiente día. La calidad de los materiales se nota premium, tiene detalles de cristal y el extractor evita que el celular se sobrecaliente mientras uso GPS."
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5 mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 font-bold text-blue-700 flex items-center justify-center text-sm">
                  JP
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">Juan Pablo Orrego</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Comprador Verificado - Cali</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: Trust indicators Badges Row */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600" style={{ color: '#ff6900' }}>
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-gray-900 text-sm">Garantía Oficial Xiaomi</h4>
                <p className="text-xs text-gray-500 mt-0.5">Soporte directo y reemplazo del producto por 1 año.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-gray-900 text-sm">Transacciones Seguras</h4>
                <p className="text-xs text-gray-500 mt-0.5">Pagos encriptados por pasarelas certificadas Wompi / Bold.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-gray-900 text-sm">Soporte Express WhatsApp</h4>
                <p className="text-xs text-gray-500 mt-0.5">Atención en vivo antes, durante y después del despacho.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: Interactive final hook promo banner banner call */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-left overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #ff6900 0%, #ff8b3d 100%)' }}>
        <div className="absolute top-0 right-0 opacity-10 translate-x-20 -translate-y-20">
          <Zap className="w-[500px] h-[500px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <span className="bg-white/20 uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-full text-white">
              OFERTA DE LANZAMIENTO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 leading-tight">
              ¿Listo para subir de nivel la carga en tu automóvil?
            </h2>
            <p className="text-white/90 text-sm sm:text-base mt-3 max-w-xl font-medium">
              Aprovecha hoy el Envío Gratis a todo Colombia y el precio especial de distribuidor directo de $179.900 COP. Despachamos tu pedido con empaque sellado oficial.
            </p>
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={onOpenCheckout}
              className="bg-white hover:bg-white/95 text-amber-700 font-extrabold text-base py-4 px-8 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-center w-full cursor-pointer hover:shadow-2xl"
              style={{ color: '#ff6900' }}
              id="cta-bottom-buy-btn"
            >
              Comprar Ahora – Recibe Gratis
            </button>
            <a 
              href="https://wa.me/573000000000?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20el%20Mi%2020W%20Wireless%20Car%20Charger%20de%20Xiaomi.%20%C2%BFTienen%20disponibilidad%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600/90 hover:bg-green-600 text-white font-bold text-sm py-3 px-6 rounded-2xl transition border border-white/25 flex items-center justify-center gap-2"
              id="wa-bottom-btn"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              Chatear con un Asesor
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
