import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cliente, catalogo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface CartItem {
  produto_uuid: string;
  name?: string;
  price?: number;
  quantidade: number;
  image_url?: string;
}

export default function CarrinhoPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["carrinho"],
    queryFn: cliente.getCarrinho,
  });

  const rawItems = (data as any)?.produtos ?? (Array.isArray(data) ? data : []);

  const { data: catalogData } = useQuery({
    queryKey: ["catalogo"],
    queryFn: catalogo.getAll,
    enabled: rawItems.length > 0,
  });

  const catalogList = (catalogData as any)?.produtos ?? (Array.isArray(catalogData) ? catalogData : []);

  const items: CartItem[] = useMemo(() => {
    return rawItems.map((item: any) => {
      const prod = catalogList.find?.((p: any) => p.produto_uuid === item.produto_uuid || p.uid === item.produto_uuid || p._id === item.produto_uuid);
      return {
        ...item,
        name: prod?.name ?? item.name,
        price: prod?.price ?? item.price,
        image_url: prod?.image_url ?? item.image_url,
      };
    });
  }, [rawItems, catalogList]);

  const removeMutation = useMutation({
    mutationFn: (uuid: string) => cliente.removeFromCarrinho(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
      toast.success("Item removido");
    },
  });

  const addMutation = useMutation({
    mutationFn: (uuid: string) => cliente.addToCarrinho(uuid, 1),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carrinho"] }),
  });

  const decMutation = useMutation({
    mutationFn: (uuid: string) => cliente.decrementCarrinho(uuid, 1),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carrinho"] }),
  });

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantidade, 0);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Carrinho vazio</p>
          <Link to="/" className="text-primary underline text-sm mt-2 inline-block">
            Ir para o catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.produto_uuid}>
                <CardContent className="p-4 flex items-center gap-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name || item.produto_uuid}</p>
                    {item.price != null && (
                      <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => decMutation.mutate(item.produto_uuid)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addMutation.mutate(item.produto_uuid)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeMutation.mutate(item.produto_uuid)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex items-center justify-between">
            <p className="text-lg font-bold">Total: R$ {total.toFixed(2)}</p>
            <Link to="/checkout">
              <Button size="lg">Finalizar pedido</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
