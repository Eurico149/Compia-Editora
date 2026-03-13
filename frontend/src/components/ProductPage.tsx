import React from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Check, Star, Truck, Book, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useStore } from '../context/StoreContext';
import { products, Product } from '../data/mock';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container px-4 md:px-8 mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h1>
        <Link to="/catalog">
          <Button variant="outline">Voltar ao Catálogo</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <div className="container px-4 md:px-8 mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <img 
              src={product.image} 
              alt={product.title} 
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Thumbnail placeholders */}
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="aspect-square rounded border border-slate-800 bg-slate-900 hover:border-violet-500 cursor-pointer overflow-hidden">
                 <img src={product.image} className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-violet-400 border-violet-500/30 bg-violet-500/10">
              {product.category}
            </Badge>
            {product.type === 'ebook' && <Badge className="bg-blue-600">E-Book</Badge>}
            {product.type === 'kit' && <Badge className="bg-amber-600">Kit</Badge>}
          </div>

          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">{product.title}</h1>
          <p className="mb-6 text-lg text-slate-400">por <span className="text-slate-200 font-medium">{product.author}</span></p>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-700'}`} />
              ))}
              <span className="ml-2 text-sm text-slate-400">({product.rating} de 5)</span>
            </div>
            <span className="h-4 w-px bg-slate-700"></span>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <Check className="h-4 w-4" /> {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </span>
          </div>

          <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
             <div className="mb-6 flex items-baseline gap-2">
               <span className="text-4xl font-bold text-white">{formatCurrency(product.price)}</span>
               <span className="text-sm text-slate-500">à vista no PIX</span>
             </div>
             
             <Button 
               size="lg" 
               className="w-full text-lg mb-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
               onClick={handleAddToCart}
               disabled={product.stock === 0}
             >
               <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
             </Button>
             
             <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
               <div className="flex items-center gap-2">
                 <Truck className="h-4 w-4" />
                 <span>Frete Grátis &gt; R$ 200</span>
               </div>
               <div className="flex items-center gap-2">
                 <Book className="h-4 w-4" />
                 <span>Envio Imediato (E-book)</span>
               </div>
             </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold text-white mb-4">Sobre o Produto</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              {product.description} Este material foi elaborado por especialistas líderes no mercado, garantindo conteúdo atualizado e prático. Ideal para profissionais que buscam aprofundamento técnico e acadêmicos.
            </p>
            
            <h4 className="text-lg font-bold text-white mb-2">Detalhes Técnicos</h4>
            <ul className="list-disc pl-5 text-slate-300 space-y-1 mb-6">
              <li>Editora: COMPIA</li>
              <li>Idioma: Português</li>
              <li>Ano de Publicação: 2024</li>
              <li>Formato: {product.type === 'physical' ? 'Impresso' : product.type === 'ebook' ? 'Digital (PDF/EPUB)' : 'Misto'}</li>
            </ul>

            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300">#{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
