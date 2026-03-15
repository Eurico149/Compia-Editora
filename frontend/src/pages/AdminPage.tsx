import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminPedidos from "@/components/admin/AdminPedidos";
import { Users, Package, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [tab, setTab] = useState("users");

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container px-4 md:px-8 mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-sm text-slate-400">Gerencie usuários e pedidos da plataforma</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-6">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" /> Usuários
            </TabsTrigger>
            <TabsTrigger
              value="pedidos"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Package className="h-4 w-4" /> Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="pedidos" className="mt-0">
            <AdminPedidos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
