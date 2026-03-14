import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminPedidos from "@/components/admin/AdminPedidos";

export default function AdminPage() {
  const [tab, setTab] = useState("users");

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <AdminUsers />
        </TabsContent>
        <TabsContent value="pedidos" className="mt-4">
          <AdminPedidos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
