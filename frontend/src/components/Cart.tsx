import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const [zipCode, setZipCode] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const navigate = useNavigate();

  const handleCalculateShipping = () => {
    if (zipCode.length < 8) {
      toast.error('CEP inválido.');
      return;
    }
    setShippingCost(15.90);
    toast.success('Frete calculado com sucesso!');
  };

  const tax = cartTotal * 0.05; // 5% mock tax
  const finalTotal = cartTotal + shippingCost + tax;

  if (cart.length === 0) {
    return (
      <div className="container px-4 md:px-8 mx-auto py-20 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-16 w-16 text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
        <p className="text-slate-400 mb-8">Parece que você ainda não adicionou nenhum livro ao seu carrinho.</p>
        <Link to="/catalog">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
            Explorar Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 mx-auto py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-violet-500" /> Carrinho de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:bg-slate-900">
              <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded bg-slate-800">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>

              <div className="flex flex-1 flex-col sm:flex-row items-center justify-between w-full">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base font-semibold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.author}</p>
                  <p className="mt-1 text-sm font-medium text-violet-400">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center rounded-md border border-slate-700 bg-slate-800">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-slate-400 hover:text-white disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-base font-bold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link to="/catalog" className="inline-flex items-center text-sm text-slate-400 hover:text-violet-400 mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continuar Comprando
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-6 border-b border-slate-800 pb-6">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.length} itens)</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Impostos estimados (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-400 items-center">
                <span>Frete</span>
                {shippingCost > 0 ? (
                  <span>{formatCurrency(shippingCost)}</span>
                ) : (
                  <span className="text-xs text-slate-500">Calcule abaixo</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-violet-400">{formatCurrency(finalTotal)}</span>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium text-slate-400 uppercase mb-2 block">Calcular Frete</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="CEP" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
                <Button variant="outline" onClick={handleCalculateShipping} disabled={!zipCode}>
                  Calcular
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700 font-bold" onClick={() => navigate('/checkout')}>
              Finalizar Compra <CreditCard className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-3 w-3" /> Compra 100% Segura
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
