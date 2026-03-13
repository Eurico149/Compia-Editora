import React, { useState } from 'react';
import {
  Users, ShoppingBag, Package, DollarSign,
  TrendingUp, AlertCircle, Trash2, AlertTriangle,
  X, Eye, Edit2, Search, ChevronRight, Mail, Phone,
  MapPin, Calendar, CreditCard
} from 'lucide-react';
import { mockOrders, User } from '../../data/mock';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useStore } from '../../context/StoreContext';

type AdminTab = 'overview' | 'products' | 'customers';

// Confirm Delete Modal
function ConfirmDeleteModal({ title, description, onConfirm, onCancel }: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400 mb-1">{description}</p>
            <p className="text-xs text-red-400 mt-2">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            <Trash2 className="mr-2 h-4 w-4" /> Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Customer Detail Drawer
function CustomerDetailDrawer({ customer, onClose }: { customer: User; onClose: () => void }) {
  const customerOrders = mockOrders.filter(o => o.customer === customer.name);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-700 h-full overflow-y-auto animate-in slide-in-from-right-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sticky top-0 bg-slate-900 z-10">
          <h3 className="font-bold text-white">Detalhes do Cliente</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-violet-600/20 flex items-center justify-center text-2xl font-bold text-violet-400 border-2 border-violet-500/30">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{customer.name}</h4>
              <p className="text-sm text-slate-400">{customer.email}</p>
              <Badge variant="outline" className="mt-1 text-xs border-violet-500/40 text-violet-400">Cliente</Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Informações Pessoais</h5>
            {customer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300">{customer.phone}</span>
              </div>
            )}
            {customer.cpf && (
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300">{customer.cpf}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300">{customer.address}, {customer.city} - {customer.state}</span>
              </div>
            )}
            {customer.createdAt && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300">Cliente desde {customer.createdAt}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-violet-400">{customerOrders.length}</p>
              <p className="text-xs text-slate-400 mt-1">Pedidos</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{formatCurrency(customer.totalSpent || 0)}</p>
              <p className="text-xs text-slate-400 mt-1">Total Gasto</p>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Histórico de Pedidos</h5>
            {customerOrders.length > 0 ? (
              <div className="space-y-2">
                {customerOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-800/30">
                    <div>
                      <p className="text-sm font-medium text-white">#{order.id}</p>
                      <p className="text-xs text-slate-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-200">{formatCurrency(order.total)}</p>
                      <Badge
                        className={`text-[10px] ${order.status === 'paid' ? 'bg-green-600' : order.status === 'pending' ? 'bg-yellow-600' : 'bg-blue-600'}`}
                      >
                        {order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : 'Enviado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-700 rounded-lg">
                Nenhum pedido encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { products, removeProduct, customers, deleteCustomer } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<string | null>(null);
  const [confirmDeleteCustomer, setConfirmDeleteCustomer] = useState<User | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<User | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');

  const totalRevenue = mockOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = mockOrders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'customers', label: 'Clientes', icon: Users },
  ];

  return (
    <>
      {/* Modals */}
      {confirmDeleteProduct && (
        <ConfirmDeleteModal
          title="Remover Produto"
          description={`Tem certeza que deseja remover "${products.find(p => p.id === confirmDeleteProduct)?.title}"?`}
          onConfirm={() => {
            removeProduct(confirmDeleteProduct);
            setConfirmDeleteProduct(null);
          }}
          onCancel={() => setConfirmDeleteProduct(null)}
        />
      )}
      {confirmDeleteCustomer && (
        <ConfirmDeleteModal
          title="Remover Cliente"
          description={`Tem certeza que deseja remover o cliente "${confirmDeleteCustomer.name}" (${confirmDeleteCustomer.email})?`}
          onConfirm={() => {
            deleteCustomer(confirmDeleteCustomer.id);
            setConfirmDeleteCustomer(null);
            setViewingCustomer(null);
          }}
          onCancel={() => setConfirmDeleteCustomer(null)}
        />
      )}
      {viewingCustomer && (
        <CustomerDetailDrawer
          customer={viewingCustomer}
          onClose={() => setViewingCustomer(null)}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-violet-500/10 p-3 text-violet-500">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Receita Total</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Pedidos</p>
                    <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Produtos</p>
                    <h3 className="text-2xl font-bold text-white">{totalProducts}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Clientes Cadastrados</p>
                    <h3 className="text-2xl font-bold text-white">{customers.length}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white">Pedidos Recentes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950 text-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">ID Pedido</th>
                      <th className="px-6 py-3 font-medium">Cliente</th>
                      <th className="px-6 py-3 font-medium">Data</th>
                      <th className="px-6 py-3 font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-medium text-slate-200">{order.id}</td>
                        <td className="px-6 py-4">{order.customer}</td>
                        <td className="px-6 py-4">{order.date}</td>
                        <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">{products.length} produto(s) no catálogo</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950 text-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Produto</th>
                      <th className="px-6 py-3 font-medium">Categoria</th>
                      <th className="px-6 py-3 font-medium">Tipo</th>
                      <th className="px-6 py-3 font-medium">Preço</th>
                      <th className="px-6 py-3 font-medium">Estoque</th>
                      <th className="px-6 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-medium text-slate-200">
                          <div className="flex items-center gap-3">
                            <img src={product.image} className="h-10 w-8 object-cover rounded flex-shrink-0" alt="" />
                            <div className="flex flex-col">
                              <span>{product.title}</span>
                              <span className="text-xs text-slate-500">{product.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.type === 'ebook' ? 'secondary' : 'default'} className="uppercase text-[10px]">
                            {product.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className={product.stock < 10 ? 'text-red-400 font-bold' : 'text-green-400'}>
                            {product.stock} un.
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-600/20 hover:text-red-400 text-slate-500"
                            onClick={() => setConfirmDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remover
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="h-4 w-4 text-violet-500" />
                <span>{filteredCustomers.length} cliente(s)</span>
              </div>
            </div>

            {/* Customer Cards */}
            <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950 text-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Cliente</th>
                      <th className="px-6 py-3 font-medium hidden md:table-cell">Localização</th>
                      <th className="px-6 py-3 font-medium hidden lg:table-cell">Cadastrado em</th>
                      <th className="px-6 py-3 font-medium">Total Gasto</th>
                      <th className="px-6 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-400 border border-violet-500/20 flex-shrink-0">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">{customer.name}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {customer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {customer.city ? (
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                              {customer.city} - {customer.state}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            {customer.createdAt || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${(customer.totalSpent || 0) > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                            {formatCurrency(customer.totalSpent || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-violet-600/20 hover:text-violet-400"
                              onClick={() => setViewingCustomer(customer)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-600/20 hover:text-red-400 text-slate-500"
                              onClick={() => setConfirmDeleteCustomer(customer)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          Nenhum cliente encontrado para "{customerSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
