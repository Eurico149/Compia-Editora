import { useQuery } from "@tanstack/react-query";
import { cliente } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Pedido {
  pedido_uuid?: string;
  uid?: string;
  status?: string;
  items?: Array<{ produto_uuid: string; name?: string; quantidade: number; type?: string }>;
  endereco?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
}

export default function PedidosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["pedidos"],
    queryFn: cliente.getPedidos,
  });

  const pedidos = (Array.isArray(data) ? data : []) as Pedido[];

  const handleEbook = async (produto_uuid: string) => {
    try {
      const result = await cliente.getEbook(produto_uuid);
      // The API likely returns a download URL or the file
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
      <div className="container py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido, idx) => (
            <Card key={pedido.pedido_uuid || pedido.uid || idx}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pedido #{(pedido.pedido_uuid || pedido.uid || "").slice(0, 8)}
                  </p>
                  {pedido.status && <Badge variant="outline">{pedido.status}</Badge>}
                </div>
                {pedido.items && (
                  <ul className="space-y-1">
                    {pedido.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <span>{item.name || item.produto_uuid} × {item.quantidade}</span>
                        {item.type === "ebook" && (
                          <Button variant="ghost" size="sm" onClick={() => handleEbook(item.produto_uuid)}>
                            <Download className="h-4 w-4 mr-1" /> E-book
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {pedido.created_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
