import React from "react";
import Navigation from "./components/Navigation";
import ProductLanding from "./components/ProductLanding";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import AdminPanel from "./components/AdminPanel";
import { Order } from "./types";
import { MessageCircle, ShoppingBag } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<"home" | "admin" | "checkout">("home");
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = React.useState(false);

  // Administrative orders list
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(false);

  // Fetch orders from our transactional backend server
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load backend orders tree:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load orders on startup
  React.useEffect(() => {
    fetchOrders();
  }, []);

  // Update specific order status in backend (Admin actions)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'APPROVED' | 'DECLINED' | 'PENDING') => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Refresh local memory grid
        fetchOrders();
      } else {
        const errData = await response.json();
        alert(`No se pudo actualizar el estado: ${errData.error || 'error desconocido'}`);
      }
    } catch (error) {
      console.error("Failed to update status on server:", error);
      alert("Error de comunicación de red al actualizar estado.");
    }
  };

  // Delete an order record (Admin administrative cleaning)
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar permanentemente este registro de compra?")) {
      return;
    }
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchOrders();
      } else {
        alert("Ocurrió un error al intentar eliminar el pedido.");
      }
    } catch (error) {
      console.error("Failed to clear order:", error);
    }
  };

  const handleOrderComplete = (order: Order, wasEmailSent: boolean) => {
    setCompletedOrder(order);
    setEmailNotificationSent(wasEmailSent);
    // Refresh admin data
    fetchOrders();
  };

  const handleResetSuccess = () => {
    setCompletedOrder(null);
    setEmailNotificationSent(false);
    setCurrentTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50/20 text-gray-800 selection:bg-amber-100 selection:text-amber-950 flex flex-col justify-between">
      
      {/* Interactive Navigation bar */}
      <Navigation 
        currentTab={currentTab === "admin" ? "admin" : "home"}
        setCurrentTab={(tab) => {
          if (tab === "admin") {
            setCurrentTab("admin");
          } else {
            setCurrentTab("home");
          }
        }}
        onOpenCheckout={() => setCurrentTab("checkout")}
        adminLoggedIn={orders.length > 0} // visual helper
        onLogoutAdmin={() => {}}
      />

      {/* Main Body */}
      <main className="flex-1">
        {completedOrder ? (
          <SuccessPage 
            order={completedOrder} 
            emailNotificationSent={emailNotificationSent}
            onReset={handleResetSuccess}
          />
        ) : currentTab === "admin" ? (
          <AdminPanel 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onRefreshOrders={fetchOrders}
          />
        ) : currentTab === "checkout" ? (
          <CheckoutPage 
            onOrderComplete={handleOrderComplete}
            onCancel={() => setCurrentTab("home")}
          />
        ) : (
          <ProductLanding onOpenCheckout={() => setCurrentTab("checkout")} />
        )}
      </main>

      {/* Footer bar */}
      <footer className="bg-gray-900 text-white font-normal text-xs py-12 border-t border-gray-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl bg-[#ff6900] text-white w-8 h-8 rounded flex items-center justify-center">
                Mi
              </span>
              <span className="font-bold text-base text-white">Xiaomi CarTech - xiaomicartech.com.co</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Somos importadores autorizados independientes del Mi 20W Wireless Car Charger. Garantizamos calidad premium, empaque de fábrica y soporte de entrega garantizado con las mejores pasarelas de pago del país.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">Medios De Pago</h4>
            <div className="flex flex-wrap gap-2 text-gray-400 font-semibold font-mono">
              <span className="bg-gray-800 py-1 px-2.5 rounded text-[10px]">Wompi</span>
              <span className="bg-gray-800 py-1 px-2.5 rounded text-[10px]">Bold Col</span>
              <span className="bg-gray-800 py-1 px-2.5 rounded text-[10px]">Efipay</span>
              <span className="bg-gray-800 py-1 px-2.5 rounded text-[10px]">Nequi</span>
              <span className="bg-gray-800 py-1 px-2.5 rounded text-[10px]">PSE/Brebv</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">Atención al Cliente</h4>
            <p className="text-gray-400">
              ¿Dudas con tu despacho? Escríbenos en cualquier momento vía WhatsApp para soporte directo.
            </p>
            <a 
              href="https://wa.me/573000000000?text=Hola%2C%20necesito%20asistencia%20respecto%20a%20mi%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl items-center gap-1.5 duration-150 transition-all text-xs"
              id="wa-footer-btn"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chatear por WhatsApp
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 font-medium text-[11px]">
          <p>© 2026 Todos los derechos reservados. Xiaomi CarTech Colombia (xiaomicartech.com.co) - Importador Independiente.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-white transition">Características</a>
            <a href="#specs" className="hover:text-white transition">Especificaciones</a>
            <span className="text-gray-700">|</span>
            <button onClick={() => setCurrentTab("admin")} className="hover:text-white transition cursor-pointer">Panel Administrador</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
