import React from 'react';
import { useSearchParams, Link } from 'react-router';
import { mockBooks } from '../data/mockData';
import { Book } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Filter, X } from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  // Initialize state from URL or empty
  const [selectedFormats, setSelectedFormats] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');

  // Sync search query from URL if it changes externally
  React.useEffect(() => {
    const search = searchParams.get('search');
    if (search !== searchQuery) {
      setSearchQuery(search || '');
    }
  }, [searchParams]);

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedFormats([]);
    setSelectedCategories([]);
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredBooks = React.useMemo(() => {
    return mockBooks.filter(book => {
      const matchesFormat = selectedFormats.length === 0 || selectedFormats.includes(book.format);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category);
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFormat && matchesCategory && matchesSearch;
    });
  }, [selectedFormats, selectedCategories, searchQuery]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
                {(selectedFormats.length > 0 || selectedCategories.length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-blue-600 h-auto p-0 hover:bg-transparent">
                    Limpar
                  </Button>
                )}
              </div>

              {/* Format Filter */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-gray-700">Formato</h4>
                <div className="space-y-2">
                  {['physical', 'ebook', 'kit'].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`format-${format}`} 
                        checked={selectedFormats.includes(format)}
                        onCheckedChange={() => toggleFormat(format)}
                      />
                      <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer">
                        {getFormatLabel(format)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Categoria</h4>
                <div className="space-y-2">
                  {['IA', 'Blockchain', 'Cibersegurança'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo Completo'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{filteredBooks.length} resultados</p>
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Nenhum livro encontrado com os filtros selecionados.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2 text-blue-600">
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full border border-gray-100"
                  >
                    {/* Header: Title */}
                    <div className="p-3 pb-2">
                      <Link to={`/book/${book.id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5em] leading-tight">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 truncate mt-1">{book.author}</p>
                    </div>

                    {/* Image */}
                    <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-50 mx-3 rounded-md">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-1 right-1 text-[10px] px-1.5 h-5 bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm">
                        {getFormatLabel(book.format)}
                      </Badge>
                    </Link>
                    
                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1 gap-2">
                      <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-5">
                        {book.category}
                      </Badge>
                      
                      <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-gray-900">
                            {formatPrice(book.price)}
                          </span>
                        </div>

                        <Button
                          onClick={() => addToCart(book)}
                          className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                          size="sm"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1.5" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
