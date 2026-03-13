export type UserRole = 'admin' | 'editor' | 'vendor' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt?: string;
  totalSpent?: number;
}

export const mockUsers: Record<UserRole, User> = {
  admin: { id: 'u1', name: 'Admin User', email: 'admin@compia.com', role: 'admin', createdAt: '2023-01-10' },
  editor: { id: 'u2', name: 'Editor User', email: 'editor@compia.com', role: 'editor', createdAt: '2023-02-15' },
  vendor: { id: 'u3', name: 'Vendor User', email: 'vendor@compia.com', role: 'vendor', createdAt: '2023-03-20' },
  customer: {
    id: 'u4', name: 'Customer User', email: 'customer@compia.com', role: 'customer',
    phone: '(11) 98765-4321', cpf: '123.456.789-00',
    address: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', zip: '01310-100',
    createdAt: '2024-01-05', totalSpent: 245.00
  },
};

export const mockCustomers: User[] = [
  {
    id: 'c1', name: 'Customer User', email: 'customer@compia.com', role: 'customer',
    phone: '(11) 98765-4321', cpf: '123.456.789-00',
    address: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', zip: '01310-100',
    createdAt: '2024-01-05', totalSpent: 245.00
  },
  {
    id: 'c2', name: 'João Silva', email: 'joao@example.com', role: 'customer',
    phone: '(21) 99876-5432', cpf: '987.654.321-00',
    address: 'Av. Atlântica, 456', city: 'Rio de Janeiro', state: 'RJ', zip: '22070-002',
    createdAt: '2024-01-18', totalSpent: 45.00
  },
  {
    id: 'c3', name: 'Maria Oliveira', email: 'maria@example.com', role: 'customer',
    phone: '(31) 97654-3210', cpf: '456.789.123-00',
    address: 'Rua das Palmeiras, 789', city: 'Belo Horizonte', state: 'MG', zip: '30140-071',
    createdAt: '2024-02-02', totalSpent: 199.90
  },
  {
    id: 'c4', name: 'Pedro Costa', email: 'pedro@example.com', role: 'customer',
    phone: '(85) 98877-6655', cpf: '321.654.987-00',
    address: 'Rua Dragão do Mar, 321', city: 'Fortaleza', state: 'CE', zip: '60060-390',
    createdAt: '2024-02-14', totalSpent: 0
  },
  {
    id: 'c5', name: 'Ana Santos', email: 'ana@example.com', role: 'customer',
    phone: '(41) 99988-7766', cpf: '654.321.098-00',
    address: 'Rua XV de Novembro, 654', city: 'Curitiba', state: 'PR', zip: '80020-310',
    createdAt: '2024-02-20', totalSpent: 120.00
  },
  {
    id: 'c6', name: 'Lucas Ferreira', email: 'lucas@example.com', role: 'customer',
    phone: '(51) 98765-1234', cpf: '789.012.345-00',
    address: 'Av. Ipiranga, 987', city: 'Porto Alegre', state: 'RS', zip: '90160-092',
    createdAt: '2024-03-01', totalSpent: 375.40
  },
];

export type ProductType = 'physical' | 'ebook' | 'kit';

export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  type: ProductType;
  pdfUrl?: string;
  tags: string[];
  stock: number;
  rating: number;
  description: string;
}

export const categories = [
  "Inteligência Artificial",
  "Arquitetura de Software",
  "Blockchain",
  "Criptografia",
  "Cibersegurança"
];

export const products: Product[] = [
  {
    id: "p1",
    title: "IA Moderna: Conceitos e Prática",
    author: "Dra. Elena Silva",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    category: "Inteligência Artificial",
    type: "physical",
    tags: ["Machine Learning", "Python"],
    stock: 15,
    rating: 4.8,
    description: "Um guia completo sobre os fundamentos e aplicações práticas de Inteligência Artificial no mercado atual."
  },
  {
    id: "p2",
    title: "Blockchain Desmistificado",
    author: "Carlos Mendez",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    category: "Blockchain",
    type: "ebook",
    tags: ["Crypto", "Web3"],
    stock: 999,
    rating: 4.5,
    description: "Entenda como a tecnologia Blockchain está revolucionando o sistema financeiro global."
  },
  {
    id: "p3",
    title: "Arquitetura de Microsserviços",
    author: "Sarah Connor",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    category: "Arquitetura de Software",
    type: "physical",
    tags: ["System Design", "Scalability"],
    stock: 8,
    rating: 4.9,
    description: "Padrões e práticas para construir sistemas distribuídos escaláveis e resilientes."
  },
  {
    id: "p4",
    title: "Kit Cibersegurança Essencial",
    author: "Equipe COMPIA",
    price: 199.90,
    image: "https://images.unsplash.com/photo-1563206767-5b1d972b9fb9?q=80&w=800&auto=format&fit=crop",
    category: "Cibersegurança",
    type: "kit",
    tags: ["Security", "Hacking Ético"],
    stock: 5,
    rating: 5.0,
    description: "O kit definitivo para iniciantes em segurança da informação. Inclui livro físico, e-book e acesso a videoaulas."
  },
  {
    id: "p5",
    title: "Criptografia Avançada",
    author: "Alan Turing Jr.",
    price: 75.50,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    category: "Criptografia",
    type: "physical",
    tags: ["Matemática", "Segurança"],
    stock: 20,
    rating: 4.7,
    description: "Mergulhe nos algoritmos que protegem o mundo digital hoje."
  },
  {
    id: "p6",
    title: "Deep Learning com PyTorch",
    author: "Li Wei",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    category: "Inteligência Artificial",
    type: "ebook",
    tags: ["Deep Learning", "Python"],
    stock: 999,
    rating: 4.6,
    description: "Aprenda a construir redes neurais profundas do zero utilizando a biblioteca PyTorch."
  },
];

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'paid' | 'pending' | 'shipped';
  total: number;
  items: { product: Product, quantity: number }[];
}

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    customer: "Customer User",
    date: "2024-02-28",
    status: "paid",
    total: 245.00,
    items: [
        { product: products[0], quantity: 1 },
        { product: products[2], quantity: 1 }
    ]
  },
  {
    id: "ord_002",
    customer: "John Doe",
    date: "2024-02-27",
    status: "pending",
    total: 45.00,
    items: [
        { product: products[1], quantity: 1 }
    ]
  },
    {
    id: "ord_003",
    customer: "Jane Smith",
    date: "2024-02-26",
    status: "shipped",
    total: 199.90,
    items: [
        { product: products[3], quantity: 1 }
    ]
  }
];