import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Filter, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { useStore } from '../context/StoreContext';
import { ProductType } from '../data/mock';

export function Catalog() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                          product.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesType = selectedType ? product.type === selectedType : true;
    const matchesTags = selectedTags.length > 0 ? selectedTags.every(tag => product.tags.includes(tag)) : true;
    
    return matchesSearch && matchesCategory && matchesTags && matchesType;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedType(null);
    setSearch('');
    setSearchParams({});
  };

  const types: { value: ProductType; label: string }[] = [
    { value: 'physical', label: 'Livro Físico' },
    { value: 'ebook', label: 'E-book' },
    { value: 'kit', label: 'Kit Completo' },
  ];


  return (
    <div className="container px-4 md:px-8 mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Catálogo</h1>
          <Button variant="outline" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-200 uppercase tracking-wider">Busca</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-200 uppercase tracking-wider">Formato</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${!selectedType ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Todos
                </button>
                {types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value === selectedType ? null : type.value)}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-left transition-colors ${selectedType === type.value ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-200 uppercase tracking-wider">Categorias</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${!selectedCategory ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-left transition-colors ${selectedCategory === cat ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-200 uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-violet-700/50"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {(selectedCategory || selectedTags.length > 0 || search || selectedType) && (
              <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-slate-800" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 hidden md:flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Catálogo Completo</h1>
            <span className="text-sm text-slate-400">{filteredProducts.length} produtos encontrados</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/30 py-20 text-center">
              <h3 className="text-lg font-semibold text-white">Nenhum produto encontrado</h3>
              <p className="text-sm text-slate-400">Tente ajustar seus filtros de busca.</p>
              <Button variant="link" onClick={clearFilters} className="mt-4">Limpar todos os filtros</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
