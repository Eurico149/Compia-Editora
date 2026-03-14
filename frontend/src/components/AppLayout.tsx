import { Link, useLocation, Outlet } from "react-router-dom";
import { ShoppingCart, Book, User, LogOut, Settings, Package, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { cliente } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function AppLayout() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const { data: carrinho } = useQuery({
    queryKey: ["carrinho"],
    queryFn: cliente.getCarrinho,
    enabled: isLoggedIn,
  });

  const rawItems = (carrinho as any)?.produtos ?? (Array.isArray(carrinho) ? carrinho : []);
  const cartCount = Array.isArray(rawItems)
    ? rawItems.reduce((sum: number, i: { quantidade?: number }) => sum + (i.quantidade || 0), 0)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>COMPIA Editora</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link to="/">
              <Button variant={location.pathname === "/" ? "secondary" : "ghost"} size="sm">
                <Book className="h-4 w-4 mr-1" /> Catálogo
              </Button>
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/carrinho">
                  <Button variant={location.pathname === "/carrinho" ? "secondary" : "ghost"} size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-1" /> Carrinho
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/pedidos">
                  <Button variant={location.pathname === "/pedidos" ? "secondary" : "ghost"} size="sm">
                    <Package className="h-4 w-4 mr-1" /> Pedidos
                  </Button>
                </Link>
              </>
            )}

            {isLoggedIn && (user?.role === "editor" || user?.role === "admin") && (
              <Link to="/editor">
                <Button variant={location.pathname.startsWith("/editor") ? "secondary" : "ghost"} size="sm">
                  <Settings className="h-4 w-4 mr-1" /> Editor
                </Button>
              </Link>
            )}

            {isLoggedIn && user?.role === "admin" && (
              <Link to="/admin">
                <Button variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"} size="sm">
                  <Users className="h-4 w-4 mr-1" /> Admin
                </Button>
              </Link>
            )}

            <div className="ml-2 border-l pl-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm">
                    <User className="h-4 w-4 mr-1" /> Entrar
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
