import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogo, cliente } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Book, ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Produto {
  produto_uuid: string;
  name: string;
  image_url?: string;
  description?: string;
  content?: string;
  price: number;
  author: string;
  type: string;
  tags?: string[];
}

export default function ProdutoPage() {
  const { uid } = useParams<{ uid: string }>();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["produto", uid],
    queryFn: () => catalogo.getById(uid!),
    enabled: !!uid,
  });

  const addMutation = useMutation({
    mutationFn: () => cliente.addToCarrinho(uid!, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
      toast.success("Adicionado ao carrinho!");
    },
    onError: () => toast.error("Erro ao adicionar ao carrinho"),
  });

  const produto = data as Produto | undefined;
  const typeLabel: Record<string, string> = { fisico: "Físico", ebook: "E-book", kit: "Kit" };
  const typeColor: Record<string, string> = {
    fisico: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    ebook: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    kit: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <div className="container px-4 md:px-8 mx-auto py-8 max-w-4xl">
          <Skeleton className="h-5 w-40 mb-6 bg-slate-800" />
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="h-80 w-full rounded-xl bg-slate-800" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4 bg-slate-800" />
              <Skeleton className="h-5 w-1/2 bg-slate-800" />
              <Skeleton className="h-8 w-1/3 bg-slate-800" />
              <Skeleton className="h-24 w-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-400 mb-4">Produto não encontrado.</p>
          <Link to="/" className="text-violet-400 hover:text-violet-300 underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          {produto.image_url ? (
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
              <img
                src={produto.image_url}
                alt={produto.name}
                className="w-full h-full object-cover max-h-[420px]"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center h-80">
              <Book className="h-16 w-16 text-slate-600" />
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col">
            <span className={cn(
              "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium mb-3",
              typeColor[produto.type] || "border-slate-700 text-slate-400"
            )}>
              {typeLabel[produto.type] || produto.type}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{produto.name}</h1>
            <p className="text-slate-400 mb-4">
              por <span className="text-slate-300 font-medium">{produto.author}</span>
            </p>

            <p className="text-4xl font-bold text-violet-400 mb-6">
              R$ {produto.price?.toFixed(2)}
            </p>

            {produto.description && (
              <p className="text-slate-300 leading-relaxed mb-6">{produto.description}</p>
            )}

            {produto.tags && produto.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {produto.tags.map((tag) => (
                  <Link key={tag} to={`/?tag=${tag}`}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:border-violet-500/40 hover:text-slate-300 transition-colors">
                      <Tag className="h-3 w-3" />{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mt-auto">
              {isLoggedIn ? (
                <Button
                  onClick={() => addMutation.mutate()}
                  disabled={addMutation.isPending}
                  size="lg"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addMutation.isPending ? "Adicionando..." : "Adicionar ao Carrinho"}
                </Button>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold">
                    Entrar para comprar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
