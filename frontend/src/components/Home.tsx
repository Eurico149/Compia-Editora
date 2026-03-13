import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { ProductCard } from './ProductCard';
import { products, categories } from '../data/mock';

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="container relative z-10 px-4 md:px-8 mx-auto flex flex-col items-center text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl max-w-4xl">
            Conhecimento Avançado para <span className="text-violet-500">Mentes Inovadoras</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-400">
            A COMPIA Editora traz o que há de mais recente em tecnologia, desde fundamentos sólidos até as inovações que estão moldando o futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/catalog">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
                Explorar Catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Destaques da Editora</h2>
              <p className="mt-2 text-slate-400">Os títulos mais vendidos e recomendados pelos especialistas.</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center text-sm font-medium text-violet-400 hover:text-violet-300">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 md:hidden text-center">
             <Link to="/catalog">
               <Button variant="outline" className="w-full">Ver todos</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
