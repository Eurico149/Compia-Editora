import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CreditCard, QrCode, Truck, User, MapPin, Copy, Check, Clock, ShieldCheck, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/utils';

type CheckoutForm = {
  name: string;
  email: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: 'credit' | 'pix';
  shippingMethod: 'correios' | 'carrier' | 'pickup';
};

const MOCK_PIX_CODE = '00020126580014BR.GOV.BCB.PIX0136cc0a36fd-e1da-4cee-8946-5d80a62e43565204000053039865802BR5925COMPIA EDITORA LTDA6009SAO PAULO62070503***6304B90A';

function PixCard({ total, orderId, onConfirm }: { total: number; orderId: number; onConfirm: () => void }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_PIX_CODE).catch(() => {});
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=7c3aed&bgcolor=0f172a&data=${encodeURIComponent(MOCK_PIX_CODE)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-violet-500/30 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <QrCode className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Pagamento via PIX</h3>
              <p className="text-xs text-slate-400">Pedido #{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Total */}
          <div className="rounded-lg bg-slate-800/50 p-4 text-center border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Valor a pagar</p>
            <p className="text-3xl font-bold text-violet-400">{formatCurrency(total)}</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-slate-400">Escaneie o QR Code com o app do seu banco</p>
            <div className="rounded-xl bg-slate-800 p-3 border border-slate-700">
              <img
                src={qrUrl}
                alt="QR Code PIX"
                className="h-48 w-48 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback QR placeholder */}
              <div className="hidden h-48 w-48 bg-slate-700 rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-violet-400" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-slate-700" />
            <span className="text-xs text-slate-500">ou copie o código</span>
            <div className="flex-1 border-t border-slate-700" />
          </div>

          {/* PIX Code Copy */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Pix Copia e Cola</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 overflow-hidden">
                <p className="text-xs text-slate-400 truncate font-mono">{MOCK_PIX_CODE}</p>
              </div>
              <Button
                type="button"
                onClick={handleCopy}
                className={`flex-shrink-0 transition-all ${copied ? 'bg-green-600 hover:bg-green-600' : 'bg-violet-600 hover:bg-violet-700'}`}
                size="sm"
              >
                {copied ? <><Check className="mr-1.5 h-4 w-4" /> Copiado!</> : <><Copy className="mr-1.5 h-4 w-4" /> Copiar</>}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
            <ol className="space-y-1 text-xs text-slate-400 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Acesse a área PIX e escolha "Pagar"</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-800 p-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-1">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Pagamento seguro e criptografado
          </div>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="mr-2 h-4 w-4" /> Já Paguei
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Checkout() {
  const { cart, cartTotal, clearCart, user } = useStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      paymentMethod: 'credit',
      shippingMethod: 'correios',
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixCard, setShowPixCard] = useState(false);
  const [pixOrderData, setPixOrderData] = useState<{ orderId: number; total: number } | null>(null);

  const paymentMethod = watch('paymentMethod');
  const shippingMethod = watch('shippingMethod');

  const shippingCost = shippingMethod === 'correios' ? 15.90 : shippingMethod === 'carrier' ? 25.90 : 0;
  const tax = cartTotal * 0.05;
  const total = cartTotal + shippingCost + tax;

  if (cart.length === 0 && !showPixCard) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    return (
      <div className="container px-4 md:px-8 mx-auto py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-violet-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Login Necessário</h1>
        <p className="text-slate-400 max-w-md">
          Para finalizar sua compra, você precisa estar logado. Isso garante que possamos acompanhar seu pedido e enviar as atualizações.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/cart')}>
            Voltar ao Carrinho
          </Button>
          <Button onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setIsProcessing(false);

    const orderId = Math.floor(Math.random() * 10000);

    if (data.paymentMethod === 'pix') {
      setPixOrderData({ orderId, total });
      setShowPixCard(true);
      return;
    }

    clearCart();
    toast.success('Pedido realizado com sucesso!');
    navigate('/order-confirmation', { state: { orderId, total, method: data.paymentMethod } });
  };

  const confirmPixPayment = () => {
    if (pixOrderData) {
      clearCart();
      setShowPixCard(false);
      toast.success('Pagamento PIX confirmado! Obrigado pela compra.');
      navigate('/order-confirmation', {
        state: { orderId: pixOrderData.orderId, total: pixOrderData.total, method: 'pix' }
      });
    }
  };

  return (
    <>
      {showPixCard && pixOrderData && (
        <PixCard
          total={pixOrderData.total}
          orderId={pixOrderData.orderId}
          onConfirm={confirmPixPayment}
        />
      )}

      <div className="container px-4 md:px-8 mx-auto py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Personal Data */}
            <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-violet-500" /> Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nome Completo</label>
                  <Input {...register('name', { required: true })} placeholder="Seu nome" />
                  {errors.name && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">E-mail</label>
                  <Input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="seu@email.com" />
                  {errors.email && <span className="text-xs text-red-500">E-mail inválido</span>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">CPF / CNPJ</label>
                  <Input {...register('document', { required: true })} placeholder="000.000.000-00" />
                  {errors.document && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-violet-500" /> Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-sm font-medium text-slate-300">Endereço Completo</label>
                  <Input {...register('address', { required: true })} placeholder="Rua, Número, Bairro" />
                  {errors.address && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Cidade</label>
                  <Input {...register('city', { required: true })} />
                  {errors.city && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Estado</label>
                  <Input {...register('state', { required: true })} placeholder="SP" maxLength={2} />
                  {errors.state && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">CEP</label>
                  <Input {...register('zip', { required: true })} placeholder="00000-000" />
                  {errors.zip && <span className="text-xs text-red-500">Campo obrigatório</span>}
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-violet-500" /> Método de Envio
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${shippingMethod === 'correios' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="correios" {...register('shippingMethod')} className="accent-violet-600 h-4 w-4" />
                    <span className="font-medium text-slate-200">Correios (PAC)</span>
                  </div>
                  <span className="font-bold text-white">R$ 15,90</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${shippingMethod === 'carrier' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="carrier" {...register('shippingMethod')} className="accent-violet-600 h-4 w-4" />
                    <span className="font-medium text-slate-200">Transportadora Express</span>
                  </div>
                  <span className="font-bold text-white">R$ 25,90</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${shippingMethod === 'pickup' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="pickup" {...register('shippingMethod')} className="accent-violet-600 h-4 w-4" />
                    <span className="font-medium text-slate-200">Retirada no Local</span>
                  </div>
                  <span className="font-bold text-green-400">Grátis</span>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-500" /> Pagamento
              </h2>

              <div className="space-y-4">
                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'credit' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="credit" {...register('paymentMethod')} className="accent-violet-600 h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-slate-300" />
                      <span className="font-medium text-slate-200">Cartão de Crédito</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-6 w-8 bg-slate-600 rounded"></div>
                    <div className="h-6 w-8 bg-slate-600 rounded"></div>
                  </div>
                </label>

                {paymentMethod === 'credit' && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded bg-slate-950/50 border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    <Input placeholder="Número do Cartão" className="col-span-2" />
                    <Input placeholder="Nome no Cartão" className="col-span-2" />
                    <Input placeholder="MM/AA" />
                    <Input placeholder="CVV" />
                  </div>
                )}

                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'pix' ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="pix" {...register('paymentMethod')} className="accent-green-500 h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-slate-200">PIX</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30 rounded-full px-2.5 py-1">Aprovação Imediata</span>
                </label>

                {paymentMethod === 'pix' && (
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-start gap-3">
                      <QrCode className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-300 mb-1">QR Code será gerado ao confirmar</p>
                        <p className="text-xs text-slate-400">Após confirmar o pedido, você receberá o QR Code e o código PIX para pagamento. O prazo de expiração é de 30 minutos.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Resumo</h3>

              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate w-40">{item.title} (x{item.quantity})</span>
                    <span className="text-slate-200">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Frete</span>
                  <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Impostos</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-violet-400">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : `Pagar ${formatCurrency(total)}`}
              </Button>

              <p className="mt-4 text-xs text-center text-slate-500">
                Ao finalizar a compra, você concorda com nossos Termos de Uso e Política de Privacidade.
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
