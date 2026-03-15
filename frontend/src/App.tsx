import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AppLayout from "@/components/AppLayout";
import Index from "@/pages/Index";
import CatalogoPage from "@/pages/CatalogoPage";
import ProdutoPage from "@/pages/ProdutoPage";
import LoginPage from "@/pages/LoginPage";
import CarrinhoPage from "@/pages/CarrinhoPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PedidosPage from "@/pages/PedidosPage";
import EditorPage from "@/pages/EditorPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { isLoggedIn, user, loading } = useAuth();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Home pública */}
              <Route path="/" element={<Index />} />
              {/* Catálogo público */}
              <Route path="/catalogo" element={<CatalogoPage />} />
              {/* Produto público */}
              <Route path="/produto/:uid" element={<ProdutoPage />} />
              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              {/* Rotas protegidas */}
              <Route path="/carrinho" element={<ProtectedRoute><CarrinhoPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/pedidos"  element={<ProtectedRoute><PedidosPage /></ProtectedRoute>} />
              <Route path="/editor"   element={<ProtectedRoute roles={["editor", "admin"]}><EditorPage /></ProtectedRoute>} />
              <Route path="/admin"    element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
