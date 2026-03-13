import React, { useState } from 'react';
import { Download, FileText, Package, ArrowLeft, User, Mail, Phone, CreditCard, MapPin, Save, X, Lock } from 'lucide-react';
import { mockOrders } from '../../data/mock';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useStore } from '../../context/StoreContext';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

function EditProfileView({ onBack }: { onBack: () => void }) {
  const { user, updateUser } = useStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '(11) 98765-4321',
      cpf: user?.cpf || '123.456.789-00',
      address: user?.address || 'Rua das Flores, 123',
      city: user?.city || 'São Paulo',
      state: user?.state || 'SP',
      zip: user?.zip || '01310-100',
    }
  });

  const onSubmit = async (data: ProfileData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    updateUser(data);
    toast.success('Dados atualizados com sucesso!');
    onBack();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Meus Dados</h1>
          <p className="text-sm text-slate-400 mt-1">Atualize suas informações pessoais</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Avatar / Identity */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-violet-600/20 flex items-center justify-center text-3xl font-bold text-violet-400 border-2 border-violet-500/30">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-slate-400 text-sm">Cliente</p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-violet-500" /> Dados Pessoais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nome Completo</label>
              <Input {...register('name', { required: 'Nome obrigatório' })} placeholder="Seu nome completo" />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <Mail className="h-3 w-3" /> E-mail
              </label>
              <Input
                type="email"
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
                })}
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Telefone
              </label>
              <Input {...register('phone')} placeholder="(00) 00000-0000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> CPF
              </label>
              <Input {...register('cpf')} placeholder="000.000.000-00" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-500" /> Endereço
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-slate-300">Endereço Completo</label>
              <Input {...register('address')} placeholder="Rua, Número, Bairro" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Cidade</label>
              <Input {...register('city')} placeholder="Cidade" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Estado</label>
              <Input {...register('state')} placeholder="SP" maxLength={2} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">CEP</label>
              <Input {...register('zip')} placeholder="00000-000" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="border-slate-700">
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700">
            {isSubmitting ? (
              <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</span>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Salvar Alterações</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function CustomerDashboard() {
  const { user } = useStore();
  const [view, setView] = useState<'main' | 'editProfile'>('main');
  const myOrders = mockOrders;

  if (view === 'editProfile') {
    return <EditProfileView onBack={() => setView('main')} />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Minha Área</h1>

      {/* Recent Orders */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-violet-500" /> Meus Pedidos Recentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Pedido</th>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {myOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-200">#{order.id}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downloads */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" /> Meus Downloads (E-books & Kits)
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 rounded bg-slate-800/50 border border-slate-700 hover:border-violet-500 transition-colors group">
              <div className="h-16 w-12 bg-slate-700 rounded flex-shrink-0 flex items-center justify-center">
                <FileText className="h-6 w-6 text-slate-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1 group-hover:text-violet-400">Blockchain Desmistificado</h4>
                <p className="text-xs text-slate-400 mb-3">PDF • 15 MB</p>
                <Button size="sm" variant="secondary" className="w-full h-8 text-xs">
                  <Download className="mr-2 h-3 w-3" /> Baixar
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded bg-slate-800/50 border border-slate-700 hover:border-violet-500 transition-colors group">
              <div className="h-16 w-12 bg-slate-700 rounded flex-shrink-0 flex items-center justify-center">
                <FileText className="h-6 w-6 text-slate-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1 group-hover:text-violet-400">Deep Learning com PyTorch</h4>
                <p className="text-xs text-slate-400 mb-3">EPUB • 8 MB</p>
                <Button size="sm" variant="secondary" className="w-full h-8 text-xs">
                  <Download className="mr-2 h-3 w-3" /> Baixar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Data */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-violet-500" /> Meus Dados
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="border-violet-500/50 text-violet-400 hover:bg-violet-600/10 hover:border-violet-400"
            onClick={() => setView('editProfile')}
          >
            Editar Dados
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Nome</span>
              <span className="text-slate-200">{user?.name || 'Customer User'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <span className="text-slate-500 block text-xs">E-mail</span>
              <span className="text-slate-200">{user?.email || 'customer@compia.com'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <span className="text-slate-500 block text-xs">CPF</span>
              <span className="text-slate-200">{user?.cpf || '***.456.789-**'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Telefone</span>
              <span className="text-slate-200">{user?.phone || '(11) 98765-4321'}</span>
            </div>
          </div>
          {(user?.address) && (
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Endereço</span>
                <span className="text-slate-200">{user.address}, {user.city} - {user.state}, {user.zip}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
