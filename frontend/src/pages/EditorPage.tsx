import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogo, editor, ProdutoDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Pencil, Book, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
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

const emptyProduto: ProdutoDTO = {
  name: "", content: "", price: 0, author: "", type: "fisico",
  image_url: "", description: "", tags: [], produto_uuid: "",
};

const typeColor: Record<string, string> = {
  fisico: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  ebook:  "bg-violet-500/10 text-violet-400 border-violet-500/30",
  kit:    "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export default function EditorPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoDTO>(emptyProduto);
  const [isEdit, setIsEdit] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["catalogo"],
    queryFn: catalogo.getAll,
  });

  const produtos = (Array.isArray(data) ? data : []) as Produto[];

  const saveMutation = useMutation({
    mutationFn: (p: ProdutoDTO) => isEdit ? editor.updateProduto(p) : editor.createProduto(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo"] });
      toast.success(isEdit ? "Produto atualizado!" : "Produto criado!");
      setOpen(false);
    },
    onError: () => toast.error("Erro ao salvar produto"),
  });

  const deleteMutation = useMutation({
    mutationFn: editor.deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogo"] });
      toast.success("Produto removido!");
    },
    onError: () => toast.error("Erro ao remover produto"),
  });

  const openCreate = () => {
    setEditing(emptyProduto);
    setTagsInput("");
    setIsEdit(false);
    setOpen(true);
  };

  const openEdit = (p: Produto) => {
    setEditing({ ...p, content: p.content || "", tags: p.tags || [], type: p.type as "fisico" | "ebook" | "kit" });
    setTagsInput((p.tags || []).join(", "));
    setIsEdit(true);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    saveMutation.mutate({ ...editing, tags });
  };

  const update = (field: keyof ProdutoDTO, value: unknown) => {
    setEditing((e) => ({ ...e, [field]: value }));
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Produtos</h1>
            <p className="text-sm text-slate-400 mt-1">{produtos.length} produto(s) cadastrado(s)</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreate}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {isEdit ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome</Label>
                  <Input required value={editing.name} onChange={(e) => update("name", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus:border-violet-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Autor</Label>
                  <Input required value={editing.author} onChange={(e) => update("author", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus:border-violet-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Preço (R$)</Label>
                    <Input type="number" step="0.01" required value={editing.price || ""}
                      onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white focus:border-violet-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Tipo</Label>
                    <Select value={editing.type} onValueChange={(v) => update("type", v)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="fisico" className="text-white hover:bg-slate-700">Físico</SelectItem>
                        <SelectItem value="ebook" className="text-white hover:bg-slate-700">E-book</SelectItem>
                        <SelectItem value="kit" className="text-white hover:bg-slate-700">Kit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">URL da Imagem</Label>
                  <Input value={editing.image_url || ""} onChange={(e) => update("image_url", e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Descrição</Label>
                  <Textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus:border-violet-500 resize-none" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Conteúdo (URL do arquivo/link)</Label>
                  <Input required value={editing.content} onChange={(e) => update("content", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white focus:border-violet-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Tags (separadas por vírgula)</Label>
                  <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="IA, Machine Learning, Python"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500" />
                </div>
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar Produto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl bg-slate-800" />)}
          </div>
        ) : produtos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-24 text-center">
            <Book className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-lg font-semibold text-white mb-1">Nenhum produto cadastrado</p>
            <p className="text-sm text-slate-400 mb-6">Crie o primeiro produto do catálogo.</p>
            <Button onClick={openCreate} className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="h-4 w-4 mr-1.5" /> Criar primeiro produto
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {produtos.map((p) => (
              <div
                key={p.produto_uuid}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-900 transition-colors"
              >
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Book className="h-6 w-6 text-slate-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{p.name}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{p.author} · R$ {p.price?.toFixed(2)}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
                      typeColor[p.type] || "border-slate-700 text-slate-400"
                    )}>
                      {p.type}
                    </span>
                    {p.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(p)}
                    className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                    onClick={() => deleteMutation.mutate(p.produto_uuid)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
