import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { CartDrawer } from '../components/CartDrawer';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <CartDrawer />
    </div>
  );
}
