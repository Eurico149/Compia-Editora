import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/utils';

export function Header() {
  const { cart, user, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-violet-600 flex items-center justify-center font-bold text-white">C</div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">COMPIA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Catálogo
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to={`/dashboard/${user.role}`}>
                <Button variant="ghost" className="text-sm font-medium text-slate-300 hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-300 hover:text-red-400">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nós
            </Link>
            <div className="border-t border-slate-800 pt-4">
              {user ? (
                <>
                  <Link 
                    to={`/dashboard/${user.role}`}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Minha Conta
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-violet-600">Login</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
