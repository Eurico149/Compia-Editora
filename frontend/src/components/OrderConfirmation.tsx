import React from 'react';
import { useLocation, Link } from 'react-router';
import { CheckCircle, ArrowRight, Download, QrCode } from 'lucide-react';
import { Button } from './ui/Button';
import { formatCurrency } from '../lib/utils';

export function OrderConfirmation() {
  const location = useLocation();
  const { orderId, total, method } = location.state || { orderId: '0000', total: 0, method: 'credit' };

  return (
    <div className="container px-4 md:px-8 mx-auto py-20 flex flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-green-500/20 p-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold text-white">Pagamento Confirmado!</h1>
      <p className="mb-8 text-lg text-slate-400">Seu pedido #{orderId} foi processado com sucesso.</p>

      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 mb-8">
        <div className="flex justify-between mb-4 pb-4 border-b border-slate-800">
          <span className="text-slate-400">Total Pago</span>
          <span className="text-xl font-bold text-violet-400">{formatCurrency(total)}</span>
        </div>
        
        {method === 'pix' && (
           <div className="mb-6">
             <p className="text-sm font-medium text-slate-300 mb-2">Código PIX para Pagamento</p>
             <div className="mx-auto bg-white p-2 w-40 h-40 flex items-center justify-center mb-2">
               <QrCode className="h-36 w-36 text-black" />
             </div>
           </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Confirmação enviada por e-mail</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Nota Fiscal emitida</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Preparando para envio</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/dashboard/customer">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Acompanhar Pedido
          </Button>
        </Link>
        <Link to="/catalog">
          <Button size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
            Continuar Comprando <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
