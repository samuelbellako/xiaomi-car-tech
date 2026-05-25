import React from "react";
import { ShoppingCart, LayoutDashboard, UserCheck, Menu, X, ShieldCheck } from "lucide-react";

interface NavigationProps {
  currentTab: "home" | "admin";
  setCurrentTab: (tab: "home" | "admin") => void;
  onOpenCheckout: () => void;
  adminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  customerName?: string;
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  onOpenCheckout,
  adminLoggedIn,
  onLogoutAdmin,
  customerName
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (sectionId: string) => {
    setCurrentTab("home");
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setCurrentTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-1.5 focus:outline-none group"
            id="nav-logo-btn"
          >
            <span className="font-extrabold text-3xl bg-amber-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-200" style={{ backgroundColor: '#ff6900' }}>
              Mi
            </span>
            <div className="text-left leading-none">
              <span className="font-bold text-lg text-gray-900 group-hover:text-[#ff6900] transition-colors block">
                Xiaomi CarTech
              </span>
              <span className="text-xs text-[#ff6900] font-semibold block tracking-wide">
                xiaomicartech.com.co
              </span>
            </div>
          </button>
          
          <span className="hidden lg:inline-block h-6 w-[1px] bg-gray-200 mx-1"></span>
          <span className="hidden lg:inline-block text-xs font-medium text-gray-500 max-w-[200px] leading-tight text-left">
            Distribuidor Autorizado del Mi 20W Wireless Car Charger
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick("features")}
            className="text-sm font-semibold text-gray-600 hover:text-amber-600 transition-colors cursor-pointer py-1"
            id="nav-features-btn"
          >
            Características
          </button>
          <button
            onClick={() => handleNavClick("specs")}
            className="text-sm font-semibold text-gray-600 hover:text-amber-600 transition-colors cursor-pointer py-1"
            id="nav-specs-btn"
          >
            Especificaciones
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className="text-sm font-semibold text-gray-600 hover:text-amber-600 transition-colors cursor-pointer py-1"
            id="nav-reviews-btn"
          >
            Reseñas
          </button>
          
          <button
            onClick={() => setCurrentTab(currentTab === "admin" ? "home" : "admin")}
            className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
              currentTab === "admin"
                ? "bg-amber-100 text-amber-700 font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            id="nav-admin-btn"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin</span>
            {adminLoggedIn && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </nav>

        {/* Action Group */}
        <div className="hidden md:flex items-center gap-4">
          {adminLoggedIn && currentTab === "admin" ? (
            <button
              onClick={onLogoutAdmin}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-200"
              id="nav-logout-btn"
            >
              Cerrar Sesión Admin
            </button>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-150 transition-all cursor-pointer"
              style={{ backgroundColor: '#ff6900' }}
              id="nav-buy-desktop-btn"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar Ahora
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-3">
          {adminLoggedIn && currentTab === "admin" ? (
            <button
              onClick={onLogoutAdmin}
              className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg"
              id="nav-mobile-logout-btn"
            >
              Salir
            </button>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-full"
              style={{ backgroundColor: '#ff6900' }}
              id="nav-mobile-buy-btn"
            >
              Comprar
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 p-1"
            id="nav-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0 animate-fade-in-up">
          <button
            onClick={() => handleNavClick("features")}
            className="w-full text-left font-bold text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-xl text-base transition-all"
            id="nav-mobile-feat-btn"
          >
            Características
          </button>
          <button
            onClick={() => handleNavClick("specs")}
            className="w-full text-left font-bold text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-xl text-base transition-all"
            id="nav-mobile-specs-btn"
          >
            Especificaciones
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className="w-full text-left font-bold text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-xl text-base transition-all"
            id="nav-mobile-reviews-btn"
          >
            Reseñas
          </button>
          <button
            onClick={() => {
              setCurrentTab(currentTab === "admin" ? "home" : "admin");
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left font-bold py-3 px-4 rounded-xl text-base flex items-center gap-2 ${
              currentTab === "admin" ? "bg-amber-50 text-amber-700" : "text-gray-700 hover:bg-amber-50"
            }`}
            id="nav-mobile-admin-btn"
          >
            <LayoutDashboard className="w-5 h-5" />
            Administrador (Sales Registry)
          </button>
        </div>
      )}
    </header>
  );
}
