import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogo, cliente } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Book, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        <p className="text-lg">Produto não encontrado.</p>
        <Link to="/" className="text-primary underline mt-2 inline-block">Voltar ao catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {produto.image_url ? (
          <img src={produto.image_url} alt={produto.name} className="w-full rounded-lg object-cover max-h-96" />
        ) : (
          <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
            <Book className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div>
          <Badge variant="outline" className="mb-2">{typeLabel[produto.type] || produto.type}</Badge>
          <h1 className="text-2xl font-bold">{produto.name}</h1>
          <p className="text-muted-foreground mt-1">por {produto.author}</p>
          <p className="text-3xl font-bold text-primary mt-4">R$ {produto.price?.toFixed(2)}</p>

          {produto.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{produto.description}</p>
          )}

          {produto.tags && produto.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {produto.tags.map((tag) => (
                <Link key={tag} to={`/?tag=${tag}`}>
                  <Badge variant="secondary">{tag}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6">
            {isLoggedIn ? (
              <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending} size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addMutation.isPending ? "Adicionando..." : "Adicionar ao carrinho"}
              </Button>
            ) : (
              <Link to="/login">
                <Button size="lg">Entrar para comprar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
