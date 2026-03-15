import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-950 px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-violet-500/30 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Página não encontrada</h1>
        <p className="text-slate-400 mb-8 max-w-sm">
          A página que você procura não existe ou foi removida.
        </p>
        <Link to="/">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            <Home className="h-4 w-4 mr-2" /> Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
