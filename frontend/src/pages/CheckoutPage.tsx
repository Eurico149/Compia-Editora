import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cliente, Endereco } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
    <div className="container py-8 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Endereço de entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Rua</Label>
                <Input required value={endereco.rua} onChange={(e) => update("rua", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input type="number" required value={endereco.numero || ""} onChange={(e) => update("numero", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input value={endereco.complemento} onChange={(e) => update("complemento", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input required value={endereco.bairro} onChange={(e) => update("bairro", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input required value={endereco.cidade} onChange={(e) => update("cidade", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input required value={endereco.estado} onChange={(e) => update("estado", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input required value={endereco.cep} onChange={(e) => update("cep", e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Criando pedido..." : "Confirmar pedido"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
