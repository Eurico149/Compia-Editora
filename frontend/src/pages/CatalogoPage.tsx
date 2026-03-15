import { useQuery } from "@tanstack/react-query";
import { catalogo } from "@/lib/api";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Book, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const FIXED_TAGS = [
    "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "Reinforcement Learning", "Robotics",
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["catalogo"],
    queryFn: () => catalogo.getAll(),
  });

  const produtos = (Array.isArray(data) ? data : []) as Produto[];
  const filtered = produtos.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => p.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const typeLabel: Record<string, string> = { fisico: "Físico", ebook: "E-book", kit: "Kit" };
  const typeColor: Record<string, string> = {
    fisico: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    ebook: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    kit: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Catálogo</h1>
            <p className="text-sm text-slate-400 mt-1">
              {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar por nome ou autor..."
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FIXED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors select-none",
                selectedTags.includes(tag)
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "border-slate-700 text-slate-400 hover:border-violet-500/50 hover:text-slate-300"
              )}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors flex items-center gap-1"
              onClick={() => setSelectedTags([])}
            >
              <X className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-24 text-center">
            <Book className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-lg font-semibold text-white">Nenhum produto encontrado</p>
            <p className="text-sm text-slate-400 mt-1">Tente buscar com outros termos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((produto) => (
              <Link key={produto.produto_uuid} to={`/produto/${produto.produto_uuid}`}>
                <div className="group rounded-xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-violet-500/40 transition-all duration-200 h-full flex flex-col">
                  {produto.image_url ? (
                    <img
                      src={produto.image_url}
                      alt={produto.name}
                      className="h-48 w-full object-cover group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-48 w-full bg-slate-800 flex items-center justify-center">
                      <Book className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <span className={cn(
                      "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium mb-2",
                      typeColor[produto.type] || "border-slate-700 text-slate-400"
                    )}>
                      {typeLabel[produto.type] || produto.type}
                    </span>
                    <h3 className="font-semibold text-white line-clamp-2 group-hover:text-violet-300 transition-colors">
                      {produto.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{produto.author}</p>
                    <p className="text-lg font-bold text-violet-400 mt-3">
                      R$ {produto.price?.toFixed(2)}
                    </p>
                    {produto.tags && produto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {produto.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
