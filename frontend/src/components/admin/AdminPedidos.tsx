import { useQuery } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Pedido {
  pedido_uuid?: string;
  uid?: string;
  user_email?: string;
  status?: string;
  items?: Array<{ name?: string; quantidade: number }>;
  created_at?: string;
  [key: string]: unknown;
}

export default function AdminPedidos() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-pedidos"],
    queryFn: admin.getAllPedidos,
  });

  const pedidos = (Array.isArray(data) ? data : []) as Pedido[];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="h-10 w-10 mx-auto mb-3" />
        <p>Nenhum pedido encontrado</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido, idx) => (
            <TableRow key={pedido.pedido_uuid || pedido.uid || idx}>
              <TableCell className="font-mono text-xs">
                {(pedido.pedido_uuid || pedido.uid || "—").slice(0, 8)}
              </TableCell>
              <TableCell>{pedido.user_email || "—"}</TableCell>
              <TableCell>
                {pedido.status && <Badge variant="outline">{pedido.status}</Badge>}
              </TableCell>
              <TableCell>
                {pedido.items ? pedido.items.length : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {pedido.created_at ? new Date(pedido.created_at).toLocaleDateString("pt-BR") : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
