import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Download, Package, ShoppingBag } from 'lucide-react';
import { mockOrders, mockBooks } from '../data/mockData';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Filter orders for the current user
  const userOrders = mockOrders.filter(order => order.customerId === user.id);
  
  // Get user's ebooks
  const userEbooks = userOrders
    .filter(order => order.status === 'ebook_released')
    .flatMap(order => order.items.filter(item => item.book.format === 'ebook'));

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; variant: any }> = {
      paid_pix: { text: 'Pago via PIX', variant: 'default' },
      awaiting_shipment: { text: 'Aguardando Envio', variant: 'secondary' },
      ebook_released: { text: 'E-book Liberado', variant: 'default' },
      shipped: { text: 'Enviado', variant: 'default' },
      delivered: { text: 'Entregue', variant: 'default' },
    };
    return labels[status] || { text: status, variant: 'secondary' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Olá, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Gerencie seus pedidos e acesse seus e-books</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Ebooks */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Meus E-books
                </CardTitle>
                <CardDescription>
                  {userEbooks.length} e-book{userEbooks.length !== 1 ? 's' : ''} disponível{userEbooks.length !== 1 ? 'eis' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userEbooks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Você ainda não possui e-books
                  </p>
                ) : (
                  userEbooks.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={item.book.cover}
                          alt={item.book.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {item.book.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.book.author}
                          </p>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </Button>
                      {index < userEbooks.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Histórico de Pedidos
                </CardTitle>
                <CardDescription>
                  {userOrders.length} pedido{userOrders.length !== 1 ? 's' : ''} realizado{userOrders.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userOrders.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Você ainda não realizou nenhum pedido
                  </p>
                ) : (
                  userOrders.map((order) => {
                    const statusInfo = getStatusLabel(order.status);
                    return (
                      <div key={order.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">Pedido {order.id}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                          </div>
                          <Badge variant={statusInfo.variant as any}>
                            {statusInfo.text}
                          </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <img
                                src={item.book.cover}
                                alt={item.book.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.book.title}</p>
                                <p className="text-xs text-gray-600">
                                  Qtd: {item.quantity} × {formatPrice(item.book.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                        </div>

                        {order.shippingAddress && (
                          <>
                            <Separator />
                            <div className="flex items-start gap-2 text-sm">
                              <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                              <div className="text-gray-600">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                  {order.shippingAddress.city} - {order.shippingAddress.state}
                                </p>
                                <p>CEP: {order.shippingAddress.zipCode}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
