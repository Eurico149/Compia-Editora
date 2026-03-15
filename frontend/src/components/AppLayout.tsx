import { Link, useLocation, Outlet } from "react-router-dom";
import { ShoppingCart, Book, User, LogOut, Settings, Package, Users, BookOpen, Menu, X, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { cliente } from "@/lib/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: carrinho } = useQuery({
    queryKey: ["carrinho"],
    queryFn: cliente.getCarrinho,
    enabled: isLoggedIn,
  });

  const rawItems = (carrinho as any)?.produtos ?? (Array.isArray(carrinho) ? carrinho : []);
  const cartCount = Array.isArray(rawItems)
    ? rawItems.reduce((sum: number, i: { quantidade?: number }) => sum + (i.quantidade || 0), 0)
    : 0;

  // Nav items — Home e Catálogo sempre visíveis; demais dependem de auth/role
  const navItems = [
    { to: "/",         label: "Início",   icon: Home,         always: true },
    { to: "/catalogo", label: "Catálogo", icon: Book,         always: true },
    { to: "/carrinho", label: "Carrinho", icon: ShoppingCart, auth: true, badge: cartCount },
    { to: "/pedidos",  label: "Pedidos",  icon: Package,      auth: true },
    { to: "/editor",   label: "Editor",   icon: Settings,     roles: ["editor", "admin"] },
    { to: "/admin",    label: "Admin",    icon: Users,        roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.always) return true;
    if (item.roles) return isLoggedIn && item.roles.includes(user?.role || "");
    if (item.auth)  return isLoggedIn;
    return false;
  });

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-7 w-7 rounded bg-violet-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-100 tracking-tight">COMPIA Editora</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative text-slate-400 hover:text-white hover:bg-slate-800",
                    isActive(item.to) && "text-white bg-slate-800"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}

            {/* Auth area */}
            <div className="ml-2 border-l border-slate-800 pl-2 flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-slate-500 hidden sm:inline truncate max-w-[140px]">{user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                    <User className="h-4 w-4 mr-1.5" /> Entrar
                  </Button>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.to)
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="border-t border-slate-800 pt-3 mt-3">
              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700">Entrar</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
