export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  format: 'physical' | 'ebook' | 'kit';
  category: 'IA' | 'Blockchain' | 'Cibersegurança';
  description: string;
  cover: string;
  stock: number;
  inStock: boolean;
  ebookLink?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  total: number;
  status: 'paid_pix' | 'awaiting_shipment' | 'ebook_released' | 'shipped' | 'delivered';
  items: CartItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: 'pix' | 'credit_card';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
