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
import { Badge } from "@/components/ui/badge";

interface UserData {
  uid: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

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
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email..."
            className="pl-9"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3" />
          <p>Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.email || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{user.uid.slice(0, 12)}...</TableCell>
                  <TableCell>
                    <Select
                      value={user.role || "user"}
                      onValueChange={(role) => roleMutation.mutate({ uid: user.uid, role })}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">user</SelectItem>
                        <SelectItem value="editor">editor</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-8 w-8"
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
