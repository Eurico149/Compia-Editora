import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { mockBooks } from '../data/mockData';

export default function BookFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookId } = useParams();
  
  const isEditing = !!bookId;
  const existingBook = isEditing ? mockBooks.find(b => b.id === bookId) : null;

  const [formData, setFormData] = React.useState({
    title: existingBook?.title || '',
    author: existingBook?.author || '',
    price: existingBook?.price || 0,
    format: existingBook?.format || 'physical',
    category: existingBook?.category || 'IA',
    description: existingBook?.description || '',
    stock: existingBook?.stock || 0,
    ebookLink: existingBook?.ebookLink || '',
  });

  const [coverPreview, setCoverPreview] = React.useState<string>(existingBook?.cover || '');

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert(isEditing ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Painel
        </Button>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Atualize as informações do livro' : 'Preencha os dados do novo livro'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Card */}
              <div className="space-y-4 p-6 border rounded-lg bg-white">
                <h3 className="font-semibold text-lg">Informações Básicas</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Livro *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Fundamentos de Machine Learning"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Autor *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Ex: Dr. João Silva"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Livro *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva o conteúdo do livro, seus diferenciais e o que o leitor aprenderá..."
                    rows={5}
                    required
                  />
                </div>
              </div>

              {/* Pricing & Format Card */}
              <div className="space-y-4 p-6 border rounded-lg bg-white">
                <h3 className="font-semibold text-lg">Preço e Formato</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Formato *</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => handleInputChange('format', value)}
                    >
                      <SelectTrigger id="format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Físico</SelectItem>
                        <SelectItem value="ebook">E-book</SelectItem>
                        <SelectItem value="kit">Kit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IA">IA</SelectItem>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="Cibersegurança">Cibersegurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.format !== 'ebook' && (
                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantidade em Estoque *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                      placeholder="0"
                      required
                    />
                  </div>
                )}

                {formData.format === 'ebook' && (
                  <div className="space-y-2">
                    <Label htmlFor="ebookLink">Link para Download *</Label>
                    <Input
                      id="ebookLink"
                      value={formData.ebookLink}
                      onChange={(e) => handleInputChange('ebookLink', e.target.value)}
                      placeholder="https://..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Cover Image Card */}
              <div className="space-y-4 p-6 border rounded-lg bg-white">
                <h3 className="font-semibold text-lg">Imagem de Capa</h3>
                
                <div className="space-y-4">
                  <Label htmlFor="cover">Upload da Capa *</Label>
                  
                  {/* Drop Zone */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="cover" className="cursor-pointer">
                      {coverPreview ? (
                        <div className="space-y-3">
                          <img
                            src={coverPreview}
                            alt="Preview"
                            className="w-32 h-48 object-cover mx-auto rounded"
                          />
                          <p className="text-sm text-blue-600">Clique para alterar a imagem</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Arraste e solte a imagem aqui
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ou clique para selecionar (PNG, JPG até 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
