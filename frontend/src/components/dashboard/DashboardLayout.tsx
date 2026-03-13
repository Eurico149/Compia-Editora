import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Settings, 
  LogOut, Menu, X, BookOpen, Truck, Download, Home 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/utils';

export function DashboardLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, path: `/dashboard/${user.role}`, roles: ['admin', 'editor', 'customer'] },
    { label: 'Produtos', icon: Package, path: '/dashboard/admin/products', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-950">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-white">
            <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-xs">C</div>
            COMPIA
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-violet-600 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <Link to="/" className="mb-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Home className="h-4 w-4" />
            Voltar para a Loja
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 border-slate-700" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:hidden">
          <Link to="/" className="font-bold text-white">COMPIA</Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm p-4 pt-20">
             <nav className="space-y-2">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      location.pathname === item.path 
                        ? "bg-violet-600 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="mt-8 flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Home className="h-5 w-5" /> Voltar para a Loja
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-5 w-5" /> Sair
                </button>
             </nav>
          </div>
        )}
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
