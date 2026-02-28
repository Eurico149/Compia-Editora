import React from 'react';
import { X, Plus, Minus, CreditCard, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { useNavigate } from 'react-router';

export function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [zipCode, setZipCode] = React.useState('');
  const [shippingCost, setShippingCost] = React.useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'credit_card' | 'pix'>('credit_card');
  const [showPixCode, setShowPixCode] = React.useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const calculateShipping = () => {
    if (zipCode.length === 8 || zipCode.length === 9) {
      // Mock shipping calculation
      setShippingCost(15.90);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === 'pix') {
      setShowPixCode(true);
    } else {
      // Mock checkout success
      alert('Pedido realizado com sucesso!');
      clearCart();
      setIsCartOpen(false);
      navigate('/dashboard');
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Carrinho de Compras</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item.book.id} className="flex gap-4 p-3 border rounded-lg">
                  <img
                    src={item.book.cover}
                    alt={item.book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.book.title}</h3>
                    <p className="text-xs text-gray-500">{item.book.format === 'physical' ? 'Físico' : item.book.format === 'ebook' ? 'E-book' : 'Kit'}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.book.price)}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.book.id)}
                        className="ml-auto text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Shipping */}
              {cartItems.some(item => item.book.format === 'physical') && (
                <div className="space-y-2">
                  <Label>Calcular Frete</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="00000-000"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      maxLength={9}
                    />
                    <Button onClick={calculateShipping} size="sm">
                      Calcular
                    </Button>
                  </div>
                  {shippingCost !== null && (
                    <p className="text-sm text-gray-600">Frete: {formatPrice(shippingCost)}</p>
                  )}
                </div>
              )}

              <Separator />

              {/* Payment Method */}
              {!showPixCode && (
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="credit_card">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Cartão
                    </TabsTrigger>
                    <TabsTrigger value="pix">
                      <QrCode className="w-4 h-4 mr-2" />
                      PIX
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit_card" className="mt-4 space-y-3">
                    <div className="flex gap-2 justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Elo_logo.svg" alt="Elo" className="h-6" />
                    </div>
                  </TabsContent>

                  <TabsContent value="pix" className="mt-4">
                    <p className="text-sm text-gray-600 text-center">
                      Ao finalizar, você receberá o QR Code para pagamento
                    </p>
                  </TabsContent>
                </Tabs>
              )}

              {/* PIX QR Code */}
              {showPixCode && (
                <div className="space-y-4 text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-600">
                    <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm">Escaneie o QR Code para pagar</p>
                  <Button
                    onClick={() => {
                      clearCart();
                      setIsCartOpen(false);
                      setShowPixCode(false);
                      navigate('/dashboard');
                    }}
                    className="w-full"
                  >
                    Já realizei o pagamento
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && !showPixCode && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            {shippingCost !== null && (
              <div className="flex justify-between text-sm">
                <span>Frete:</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatPrice(getCartTotal() + (shippingCost || 0))}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700">
              Finalizar Compra
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
