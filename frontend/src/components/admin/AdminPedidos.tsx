import { useQuery } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Pedido {
  pedido_uuid?: string;
  uid?: string;
  user_email?: string;
  status?: string;
  items?: Array<{ name?: string; quantidade: number }>;
  created_at?: string;
  [key: string]: unknown;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pendente:    { label: "Pendente",    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  processando: { label: "Processando", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  enviado:     { label: "Enviado",     color: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  entregue:    { label: "Entregue",    color: "bg-green-500/10 text-green-400 border-green-500/30" },
};

export default function AdminPedidos() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-pedidos"],
    queryFn: admin.getAllPedidos,
  });

  const pedidos = (Array.isArray(data) ? data : []) as Pedido[];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg bg-slate-800" />)}
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-16 text-center">
        <Package className="h-10 w-10 text-slate-700 mb-3" />
        <p className="text-white font-medium">Nenhum pedido encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Pedido</TableHead>
            <TableHead className="text-slate-400">Usuário</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Itens</TableHead>
            <TableHead className="text-slate-400">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido, idx) => {
            const statusKey = (pedido.status || "").toLowerCase();
            const cfg = statusConfig[statusKey];

            return (
              <TableRow key={pedido.pedido_uuid || pedido.uid || idx} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-mono text-xs text-slate-400">
                  #{(pedido.pedido_uuid || pedido.uid || "—").slice(0, 8)}
                </TableCell>
                <TableCell className="text-slate-200">{pedido.user_email || "—"}</TableCell>
                <TableCell>
                  {pedido.status && (
                    <span className={cn(
                      "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      cfg?.color || "bg-slate-700 text-slate-300 border-slate-600"
                    )}>
                      {cfg?.label || pedido.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-slate-300">
                  {pedido.items ? `${pedido.items.length} item(s)` : "—"}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {pedido.created_at ? new Date(pedido.created_at).toLocaleDateString("pt-BR") : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
