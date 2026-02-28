import { Book, Order } from './types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Fundamentos de Machine Learning',
    author: 'Dr. Ana Silva',
    price: 89.90,
    format: 'physical',
    category: 'IA',
    description: 'Uma introdução completa aos conceitos fundamentais de Machine Learning, com exemplos práticos e aplicações do mundo real. Aprenda algoritmos de aprendizado supervisionado e não supervisionado.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop',
    stock: 15,
    inStock: true,
  },
  {
    id: '2',
    title: 'Deep Learning na Prática',
    author: 'Prof. Carlos Mendes',
    price: 129.90,
    format: 'physical',
    category: 'IA',
    description: 'Explore redes neurais profundas, CNNs, RNNs e transformers. Inclui projetos práticos com TensorFlow e PyTorch para reconhecimento de imagem e processamento de linguagem natural.',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    stock: 8,
    inStock: true,
  },
  {
    id: '3',
    title: 'Blockchain: Descentralização e Futuro',
    author: 'Dra. Beatriz Costa',
    price: 99.90,
    format: 'ebook',
    category: 'Blockchain',
    description: 'Entenda a tecnologia blockchain desde os fundamentos até aplicações avançadas. Contratos inteligentes, DeFi, NFTs e o futuro da Web3.',
    cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop',
    stock: 999,
    inStock: true,
    ebookLink: 'https://example.com/download/blockchain-guide.pdf',
  },
  {
    id: '4',
    title: 'Criptografia Aplicada',
    author: 'Prof. Roberto Lima',
    price: 79.90,
    format: 'physical',
    category: 'Cibersegurança',
    description: 'Técnicas modernas de criptografia, desde cifras clássicas até criptografia pós-quântica. Inclui implementações práticas e análise de segurança.',
    cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=600&fit=crop',
    stock: 12,
    inStock: true,
  },
  {
    id: '5',
    title: 'Segurança em Redes e Sistemas',
    author: 'Eng. Márcia Oliveira',
    price: 94.90,
    format: 'physical',
    category: 'Cibersegurança',
    description: 'Proteja suas redes e sistemas contra ameaças modernas. Aprenda sobre firewalls, IDS/IPS, análise de vulnerabilidades e resposta a incidentes.',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop',
    stock: 20,
    inStock: true,
  },
  {
    id: '6',
    title: 'Kit IA Completo: Livro + Guias Práticos',
    author: 'COMPIA Editora',
    price: 199.90,
    format: 'kit',
    category: 'IA',
    description: 'Kit completo com livro físico, e-books complementares e acesso a materiais exclusivos online. Tudo que você precisa para dominar Inteligência Artificial.',
    cover: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=600&fit=crop',
    stock: 5,
    inStock: true,
  },
  {
    id: '7',
    title: 'Ethereum e Smart Contracts',
    author: 'Dr. Felipe Santos',
    price: 84.90,
    format: 'ebook',
    category: 'Blockchain',
    description: 'Aprenda a desenvolver contratos inteligentes na plataforma Ethereum. Solidity, Web3.js e desenvolvimento de DApps do zero.',
    cover: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=600&fit=crop',
    stock: 999,
    inStock: true,
    ebookLink: 'https://example.com/download/ethereum-contracts.pdf',
  },
  {
    id: '8',
    title: 'Visão Computacional com OpenCV',
    author: 'Dra. Juliana Rocha',
    price: 109.90,
    format: 'physical',
    category: 'IA',
    description: 'Processamento de imagens e vídeos, detecção de objetos, reconhecimento facial e muito mais usando OpenCV e técnicas modernas de visão computacional.',
    cover: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=600&fit=crop',
    stock: 10,
    inStock: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'user-1',
    customerName: 'João Silva',
    date: '2026-02-20',
    total: 89.90,
    status: 'paid_pix',
    items: [
      { book: mockBooks[0], quantity: 1 }
    ],
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    paymentMethod: 'pix'
  },
  {
    id: 'ORD-002',
    customerId: 'user-2',
    customerName: 'Maria Oliveira',
    date: '2026-02-21',
    total: 99.90,
    status: 'ebook_released',
    items: [
      { book: mockBooks[2], quantity: 1 }
    ],
    paymentMethod: 'credit_card'
  },
  {
    id: 'ORD-003',
    customerId: 'user-3',
    customerName: 'Pedro Santos',
    date: '2026-02-22',
    total: 224.80,
    status: 'awaiting_shipment',
    items: [
      { book: mockBooks[1], quantity: 1 },
      { book: mockBooks[3], quantity: 1 }
    ],
    shippingAddress: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    paymentMethod: 'credit_card'
  },
];
