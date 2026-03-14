import { useQuery } from "@tanstack/react-query";
import { catalogo } from "@/lib/api";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Produto {
  produto_uuid: string;
  name: string;
  image_url?: string;
  description?: string;
  price: number;
  author: string;
  type: string;
  tags?: string[];
}

export default function CatalogoPage() {
  const [searchParams] = useSearchParams();
  const tagFilter = searchParams.get("tag");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["catalogo", tagFilter],
    queryFn: () => (tagFilter ? catalogo.getByTag(tagFilter) : catalogo.getAll()),
  });

  const produtos = (Array.isArray(data) ? data : []) as Produto[];
  const filtered = produtos.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase())
  );

  const typeLabel: Record<string, string> = { fisico: "Físico", ebook: "E-book", kit: "Kit" };

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Catálogo</h1>
          {tagFilter && (
            <p className="text-muted-foreground mt-1">
              Filtrando por: <Badge variant="secondary">{tagFilter}</Badge>
              <Link to="/" className="ml-2 text-primary text-sm underline">Limpar</Link>
            </p>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou autor..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Book className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Nenhum produto encontrado</p>
          <p className="text-sm">Tente buscar com outros termos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((produto) => (
            <Link key={produto.produto_uuid} to={`/produto/${produto.produto_uuid}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-150 h-full">
                {produto.image_url ? (
                  <img
                    src={produto.image_url}
                    alt={produto.name}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-48 w-full bg-muted flex items-center justify-center">
                    <Book className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">{typeLabel[produto.type] || produto.type}</Badge>
                  <h3 className="font-semibold line-clamp-2">{produto.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{produto.author}</p>
                  <p className="text-lg font-bold text-primary mt-2">
                    R$ {produto.price?.toFixed(2)}
                  </p>
                  {produto.tags && produto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {produto.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
