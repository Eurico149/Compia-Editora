import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockBooks, mockOrders } from '../data/mockData';
import { Plus, Pencil, Trash2, Eye, BookOpen, ShoppingBag, Users } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      physical: 'Físico',
      ebook: 'E-book',
      kit: 'Kit'
    };
    return labels[format] || format;
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
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
          <p className="text-gray-600 mt-1">Gerencie o catálogo, pedidos e clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Livros</p>
                  <p className="text-3xl font-bold mt-1">{mockBooks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos</p>
                  <p className="text-3xl font-bold mt-1">{mockOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-3xl font-bold mt-1">
                    {formatPrice(mockOrders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList>
            <TabsTrigger value="books">Gestão de Catálogo</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>

          {/* Books Management */}
          <TabsContent value="books">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Livros Cadastrados</CardTitle>
                <Link to="/admin/books/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Novo Livro
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Capa</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Formato</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-gray-500">{book.author}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getFormatLabel(book.format)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(book.price)}
                        </TableCell>
                        <TableCell>
                          {book.format === 'ebook' ? (
                            <span className="text-gray-500">Digital</span>
                          ) : (
                            <span className={book.stock < 5 ? 'text-red-600 font-semibold' : ''}>
                              {book.stock} unid.
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/books/edit/${book.id}`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => {
                      const statusInfo = getStatusLabel(order.status);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono font-semibold">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell className="font-semibold">
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                              {statusInfo.text}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Ver Detalhes
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
