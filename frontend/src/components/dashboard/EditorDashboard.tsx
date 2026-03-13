import React, { useState } from 'react';
import { Package, Edit2, Plus, Save, ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Product, ProductType } from '../../data/mock';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useStore } from '../../context/StoreContext';

// Confirm Delete Modal
function ConfirmDeleteModal({ product, onConfirm, onCancel }: {
  product: Product;
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
            <h3 className="text-lg font-bold text-white mb-1">Remover Produto</h3>
            <p className="text-sm text-slate-400 mb-1">
              Tem certeza que deseja remover o produto:
            </p>
            <p className="text-sm font-semibold text-white mb-4">"{product.title}"</p>
            <p className="text-xs text-red-400">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Remover
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EditorDashboard() {
  const { products, categories, addProduct, updateProduct, removeProduct, addCategory } = useStore();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Product>();
  const selectedType = watch('type');
  
  const handleCreateNew = () => {
    setEditingProduct(null);
    reset({
      id: `p${Date.now()}`,
      title: '',
      author: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
      category: categories[0],
      type: 'physical',
      tags: [],
      stock: 10,
      rating: 0,
      description: ''
    });
    setView('form');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset(product);
    setView('form');
  };

  const handleCancelForm = () => {
    setView('list');
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (data: Product) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      tags: Array.isArray(data.tags) ? data.tags : typeof data.tags === 'string' ? (data.tags as string).split(',').map((t: string) => t.trim()) : []
    };

    if (editingProduct) {
      updateProduct(formattedData);
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct(formattedData);
      toast.success('Produto criado com sucesso!');
    }
    setView('list');
    setEditingProduct(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
      toast.success('Categoria adicionada!');
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteProduct) {
      removeProduct(confirmDeleteProduct.id);
      toast.success(`Produto "${confirmDeleteProduct.title}" removido.`);
      setConfirmDeleteProduct(null);
    }
  };

  if (view === 'form') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancelForm}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informações Básicas</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Título</label>
                <Input {...register('title', { required: true })} placeholder="Título do Livro" />
                {errors.title && <span className="text-xs text-red-500">Campo obrigatório</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Autor</label>
                <Input {...register('author', { required: true })} placeholder="Nome do Autor" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Preço (R$)</label>
                  <Input type="number" step="0.01" {...register('price', { required: true, min: 0 })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Estoque</label>
                  <Input type="number" {...register('stock', { required: true, min: 0 })} />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Classificação</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Categoria</label>
                <div className="flex gap-2">
                  <select
                    {...register('category')}
                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsAddingCategory(!isAddingCategory)} title="Nova Categoria">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {isAddingCategory && (
                  <div className="flex gap-2 mt-2 animate-in fade-in zoom-in-95">
                    <Input
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      placeholder="Nome da nova categoria"
                    />
                    <Button type="button" onClick={handleAddCategory} size="sm" className="bg-green-600 hover:bg-green-700">Adicionar</Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tipo de Produto</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="physical" {...register('type')} className="accent-violet-600" />
                    <span className="text-slate-300">Físico</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="ebook" {...register('type')} className="accent-violet-600" />
                    <span className="text-slate-300">E-book</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="kit" {...register('type')} className="accent-violet-600" />
                    <span className="text-slate-300">Kit</span>
                  </label>
                </div>
              </div>

              {/* NOVA PARTE AQUI: Aparece apenas se for E-book */}
              {selectedType === 'ebook' && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <label className="text-sm font-medium text-slate-300">Link do PDF</label>
                  <Input 
                    {...register('pdfUrl', { required: selectedType === 'ebook' })} 
                    placeholder="https://drive.google.com/" 
                  />
                  {errors.pdfUrl && <span className="text-xs text-red-500">Campo obrigatório para e-books</span>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">URL da Imagem</label>
                <Input {...register('image')} placeholder="https://..." />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detalhes</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Descrição</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancelForm} className="border-slate-700 hover:bg-slate-800">
              <X className="mr-2 h-4 w-4" /> Cancelar Operação
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              <Save className="mr-2 h-4 w-4" /> Salvar Produto
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {confirmDeleteProduct && (
        <ConfirmDeleteModal
          product={confirmDeleteProduct}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteProduct(null)}
        />
      )}

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Painel do Editor</h1>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Catálogo de Produtos</h2>
            <span className="text-sm text-slate-500">{products.length} produto(s)</span>
          </div>
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-violet-600/20 hover:text-violet-400"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-600/20 hover:text-red-400 text-slate-500"
                          onClick={() => setConfirmDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
