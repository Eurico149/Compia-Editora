import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogo, editor, ProdutoDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Pencil, Book } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input required value={editing.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Autor</Label>
                <Input required value={editing.author} onChange={(e) => update("author", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input type="number" step="0.01" required value={editing.price || ""} onChange={(e) => update("price", parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={editing.type} onValueChange={(v) => update("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisico">Físico</SelectItem>
                      <SelectItem value="ebook">E-book</SelectItem>
                      <SelectItem value="kit">Kit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input value={editing.image_url || ""} onChange={(e) => update("image_url", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo (URL do arquivo/link)</Label>
                <Input required value={editing.content} onChange={(e) => update("content", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="IA, Machine Learning, Python" />
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Book className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhum produto cadastrado</p>
          <Button className="mt-4" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Criar primeiro produto</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {produtos.map((p) => (
            <Card key={p.produto_uuid}>
              <CardContent className="p-4 flex items-center gap-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded bg-muted flex items-center justify-center">
                    <Book className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.author} · R$ {p.price?.toFixed(2)}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    {p.tags?.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(p.produto_uuid)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
