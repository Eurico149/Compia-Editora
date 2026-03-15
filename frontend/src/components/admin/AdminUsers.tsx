import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserData {
  uid: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

const roleColor: Record<string, string> = {
  admin:  "bg-red-500/10 text-red-400 border-red-500/30",
  editor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  user:   "bg-slate-700 text-slate-300 border-slate-600",
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: admin.getAllUsers,
  });

  const users = ((data as any)?.users ?? (Array.isArray(data) ? data : [])) as UserData[];

  const deleteMutation = useMutation({
    mutationFn: admin.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Usuário removido");
    },
    onError: () => toast.error("Erro ao remover usuário"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ uid, role }: { uid: string; role: string }) => admin.changeUserRole(uid, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role atualizada");
    },
    onError: () => toast.error("Erro ao atualizar role"),
  });

  const filtered = searchEmail
    ? users.filter((u) => u.email?.toLowerCase().includes(searchEmail.toLowerCase()))
    : users;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg bg-slate-800" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por email..."
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
        <span className="text-sm text-slate-500">{filtered.length} usuário(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-16 text-center">
          <Users className="h-10 w-10 text-slate-700 mb-3" />
          <p className="text-white font-medium">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">UID</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="w-16 text-slate-400">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.uid} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-slate-200">{user.email || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{user.uid.slice(0, 12)}...</TableCell>
                  <TableCell>
                    <Select
                      value={user.role || "user"}
                      onValueChange={(role) => roleMutation.mutate({ uid: user.uid, role })}
                    >
                      <SelectTrigger className={cn(
                        "w-32 h-7 text-xs rounded-full border",
                        roleColor[user.role || "user"] || roleColor["user"]
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="user" className="text-white">user</SelectItem>
                        <SelectItem value="editor" className="text-white">editor</SelectItem>
                        <SelectItem value="admin" className="text-white">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                      onClick={() => {
                        if (confirm("Remover este usuário?")) deleteMutation.mutate(user.uid);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
