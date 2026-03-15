import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cliente, catalogo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
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
      const prod = catalogList.find?.((p: any) =>
        p.produto_uuid === item.produto_uuid || p.uid === item.produto_uuid || p._id === item.produto_uuid
      );
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
      <div className="bg-slate-950 min-h-screen">
        <div className="container px-4 md:px-8 mx-auto py-8 max-w-3xl space-y-4">
          <Skeleton className="h-8 w-40 bg-slate-800" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl bg-slate-800" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 text-violet-400" /> Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-24 text-center">
            <ShoppingCart className="h-12 w-12 text-slate-700 mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Carrinho vazio</h2>
            <p className="text-sm text-slate-400 mb-6">
              Você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Link to="/">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                Ir para o catálogo
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {items.map((item) => (
                <div
                  key={item.produto_uuid}
                  className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-900 transition-colors"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-6 w-6 text-slate-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name || item.produto_uuid}</p>
                    {item.price != null && (
                      <p className="text-sm text-violet-400 mt-0.5 font-medium">
                        R$ {item.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800">
                    <button
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      onClick={() => decMutation.mutate(item.produto_uuid)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">
                      {item.quantidade}
                    </span>
                    <button
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      onClick={() => addMutation.mutate(item.produto_uuid)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {item.price != null && (
                    <p className="text-base font-bold text-white min-w-[80px] text-right">
                      R$ {(item.price * item.quantidade).toFixed(2)}
                    </p>
                  )}

                  <button
                    onClick={() => removeMutation.mutate(item.produto_uuid)}
                    className="text-slate-500 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Continuar Comprando
            </Link>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6">Resumo do Pedido</h2>
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                <span className="text-slate-400">Subtotal ({items.length} {items.length === 1 ? "item" : "itens"})</span>
                <span className="text-white font-medium">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-violet-400">R$ {total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold">
                  Finalizar Pedido <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                Compra 100% Segura
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
