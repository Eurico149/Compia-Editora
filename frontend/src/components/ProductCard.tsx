import React from 'react';
import { Link } from 'react-router';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Product } from '../data/mock';
import { formatCurrency } from '../lib/utils';
import { useStore } from '../context/StoreContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-all hover:border-violet-600/50 hover:shadow-lg hover:shadow-violet-900/20">
      
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
           <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
             {product.stock > 0 ? "Em Estoque" : "Esgotado"}
           </Badge>
        </div>
        {product.type === 'ebook' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600 text-white border-none">E-book</Badge>
          </div>
        )}
        {product.type === 'kit' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-amber-600 text-white border-none">Kit</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1 text-yellow-500">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-medium text-slate-300">{product.rating}</span>
        </div>

        <h3 className="mb-1 text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-violet-400 transition-colors">
          {product.title}
        </h3>
        <p className="mb-4 text-sm text-slate-400 line-clamp-1">
          {product.author}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {formatCurrency(product.price)}
          </span>
          <Button size="icon" variant="secondary" onClick={handleAddToCart} disabled={product.stock === 0} className="hover:bg-violet-600 hover:text-white transition-colors">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
