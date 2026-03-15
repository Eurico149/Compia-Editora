import { useQuery } from "@tanstack/react-query";
import { cliente } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Package, Download, Clock, CheckCircle2, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Pedido {
  pedido_uuid?: string;
  uid?: string;
  status?: string;
  items?: Array<{ produto_uuid: string; name?: string; quantidade: number; type?: string }>;
  endereco?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pendente:    { label: "Pendente",    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: Clock },
  processando: { label: "Processando", color: "bg-blue-500/10 text-blue-400 border-blue-500/30",   icon: Clock },
  enviado:     { label: "Enviado",     color: "bg-violet-500/10 text-violet-400 border-violet-500/30", icon: Truck },
  entregue:    { label: "Entregue",    color: "bg-green-500/10 text-green-400 border-green-500/30",  icon: CheckCircle2 },
};

export default function PedidosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["pedidos"],
    queryFn: cliente.getPedidos,
  });

  const pedidos = (Array.isArray(data) ? data : []) as Pedido[];

  const handleEbook = async (produto_uuid: string) => {
    try {
      const result = await cliente.getEbook(produto_uuid);
      if (result && typeof result === "object" && "url" in (result as Record<string, unknown>)) {
        window.open((result as Record<string, string>).url, "_blank");
      } else {
        toast.info("E-book solicitado. Verifique a resposta da API.");
      }
    } catch {
      toast.error("Erro ao baixar e-book.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <div className="container px-4 md:px-8 mx-auto py-8 max-w-2xl space-y-4">
          <Skeleton className="h-8 w-48 bg-slate-800" />
          {[1, 2].map((i) => <Skeleton key={i} className="h-36 w-full rounded-xl bg-slate-800" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Package className="h-6 w-6 text-violet-400" /> Meus Pedidos
        </h1>

        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-24 text-center">
            <Package className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-lg font-semibold text-white mb-1">Nenhum pedido encontrado</p>
            <p className="text-sm text-slate-400">Seus pedidos aparecerão aqui após a compra.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido, idx) => {
              const statusKey = (pedido.status || "").toLowerCase();
              const cfg = statusConfig[statusKey];
              const StatusIcon = cfg?.icon ?? Package;

              return (
                <div
                  key={pedido.pedido_uuid || pedido.uid || idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-mono font-medium text-slate-400">
                        Pedido #{(pedido.pedido_uuid || pedido.uid || "").slice(0, 8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {pedido.created_at && (
                        <span className="text-xs text-slate-500">
                          {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                      {pedido.status && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                          cfg?.color || "bg-slate-700 text-slate-300 border-slate-600"
                        )}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg?.label || pedido.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {pedido.items && (
                    <ul className="space-y-2">
                      {pedido.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm py-2 border-t border-slate-800 first:border-t-0 first:pt-0"
                        >
                          <span className="text-slate-300">
                            {item.name || item.produto_uuid}
                            <span className="text-slate-500 ml-1">× {item.quantidade}</span>
                          </span>
                          {item.type === "ebook" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEbook(item.produto_uuid)}
                              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 h-7 px-2"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Baixar E-book
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
