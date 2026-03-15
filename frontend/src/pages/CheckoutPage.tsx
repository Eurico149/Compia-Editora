import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cliente, Endereco } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [endereco, setEndereco] = useState<Endereco>({
    rua: "", numero: 0, bairro: "", cidade: "", estado: "", cep: "", complemento: "",
  });

  const mutation = useMutation({
    mutationFn: () => cliente.createPedido(endereco),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      toast.success("Pedido criado com sucesso!");
      navigate("/pedidos");
    },
    onError: () => toast.error("Erro ao criar pedido. Verifique os dados."),
  });

  const update = (field: keyof Endereco, value: string | number) => {
    setEndereco((e) => ({ ...e, [field]: value }));
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8 max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-violet-400" /> Endereço de Entrega
        </h1>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <form
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
            className="space-y-5"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-slate-300">Rua</Label>
                <Input
                  required
                  value={endereco.rua}
                  onChange={(e) => update("rua", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Número</Label>
                <Input
                  type="number"
                  required
                  value={endereco.numero || ""}
                  onChange={(e) => update("numero", parseInt(e.target.value) || 0)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Complemento</Label>
              <Input
                value={endereco.complemento}
                onChange={(e) => update("complemento", e.target.value)}
                placeholder="Apto, bloco... (opcional)"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bairro</Label>
              <Input
                required
                value={endereco.bairro}
                onChange={(e) => update("bairro", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Cidade</Label>
                <Input
                  required
                  value={endereco.cidade}
                  onChange={(e) => update("cidade", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Estado</Label>
                <Input
                  required
                  value={endereco.estado}
                  onChange={(e) => update("estado", e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                  className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">CEP</Label>
              <Input
                required
                value={endereco.cep}
                onChange={(e) => update("cep", e.target.value)}
                placeholder="00000-000"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold mt-2"
              disabled={mutation.isPending}
              size="lg"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando pedido...
                </span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Pedido
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
