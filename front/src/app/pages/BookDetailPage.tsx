import React from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { mockBooks } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Package, Download, Minus, Plus } from 'lucide-react';

export default function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const book = mockBooks.find(b => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Livro não encontrado</h2>
          <Link to="/">
            <Button>Voltar ao catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getFormatLabel = (format: typeof book.format) => {
    const labels = {
      physical: 'Físico',
      ebook: 'E-book Digital',
      kit: 'Kit Completo'
    };
    return labels[format];
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao catálogo
        </Button>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left: Image */}
            <div className="space-y-4">
              <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Category Badge */}
              <Badge variant="secondary" className="text-sm">
                {book.category}
              </Badge>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-gray-600">{book.author}</p>
              </div>

              {/* Price */}
              <div>
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(book.price)}
                </span>
              </div>

              <Separator />

              {/* Format & Availability */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {book.format === 'ebook' ? (
                    <Download className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Package className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Formato</p>
                    <p className="font-semibold">{getFormatLabel(book.format)}</p>
                  </div>
                </div>

                {book.format === 'physical' && (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${book.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">
                      {book.inStock ? `${book.stock} unidades em estoque` : 'Indisponível'}
                    </span>
                  </div>
                )}

                {book.format === 'ebook' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      📥 Download imediato após a compra
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Quantity Selector */}
              {book.format !== 'ebook' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                      disabled={quantity >= book.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={!book.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {book.format === 'ebook' ? 'Comprar E-book' : 'Adicionar ao Carrinho'}
              </Button>

              {/* Description */}
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Entrega Rápida</h3>
            <p className="text-sm text-gray-600">
              Receba em até 7 dias úteis para livros físicos
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Pagamento Seguro</h3>
            <p className="text-sm text-gray-600">
              Pague com cartão de crédito ou PIX
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Conteúdo Acadêmico</h3>
            <p className="text-sm text-gray-600">
              Livros escritos por especialistas renomados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
