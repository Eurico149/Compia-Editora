import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { mockOrders } from '../data/mockData';
import { ArrowLeft, Package, Download, CreditCard, QrCode } from 'lucide-react';

export default function OrderDetailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const order = mockOrders.find(o => o.id === orderId);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Pedido não encontrado</h2>
          <Button onClick={() => navigate('/admin')}>Voltar ao Painel</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; className: string }> = {
      paid_pix: { text: 'Pago via PIX', className: 'bg-green-100 text-green-800' },
      awaiting_shipment: { text: 'Aguardando Envio', className: 'bg-yellow-100 text-yellow-800' },
      ebook_released: { text: 'E-book Liberado', className: 'bg-blue-100 text-blue-800' },
      shipped: { text: 'Enviado', className: 'bg-purple-100 text-purple-800' },
      delivered: { text: 'Entregue', className: 'bg-gray-100 text-gray-800' },
    };
    return labels[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusInfo = getStatusLabel(order.status);
  const hasPhysicalItems = order.items.some(item => item.book.format === 'physical');
  const hasEbooks = order.items.some(item => item.book.format === 'ebook');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Painel
        </Button>

        {/* Order Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Pedido {order.id}</CardTitle>
                <p className="text-gray-600 mt-1">{formatDate(order.date)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
                {statusInfo.text}
              </span>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-semibold">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID do Cliente</p>
                  <p className="font-mono text-sm">{order.customerId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      <img
                        src={item.book.cover}
                        alt={item.book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.book.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.book.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.book.format === 'physical' ? 'Físico' : item.book.format === 'ebook' ? 'E-book' : 'Kit'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.book.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">
                            Qtd: {item.quantity} × {formatPrice(item.book.price)}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(item.book.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && hasPhysicalItems && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                    <p>CEP: {order.shippingAddress.zipCode}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ebook Download Log */}
            {hasEbooks && order.status === 'ebook_released' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Log de Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Status</span>
                      <span className="font-semibold text-green-600">E-books liberados</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Data de liberação</span>
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Downloads realizados</span>
                      <span>2 de {order.items.filter(i => i.book.format === 'ebook').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {order.paymentMethod === 'pix' ? (
                    <>
                      <QrCode className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">PIX</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Cartão de Crédito</span>
                    </>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  {hasPhysicalItems && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span>{formatPrice(15.90)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.total + (hasPhysicalItems ? 15.90 : 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Atualizar Status
                </Button>
                <Button className="w-full" variant="outline">
                  Enviar E-mail ao Cliente
                </Button>
                <Button className="w-full" variant="outline">
                  Gerar Nota Fiscal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
