import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { User, Shield, Briefcase, ShoppingBag } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../data/mock';

export function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: UserRole) => {
    login(role);
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      navigate(`/dashboard/${role}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-slate-800 bg-slate-900 p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded bg-violet-600 flex items-center justify-center font-bold text-white text-2xl">C</div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Bem-vindo à COMPIA</h2>
        </div>
        <div className="mt-8 space-y-4">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('admin'); }}>
            <Input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
              Entrar
            </Button>
          </form>
          <div className="cadastro-link">
            <p className="text-center text-xs text-slate-500 mt-4">
              Não tem uma conta?{' '}
              {/* O botão abaixo navega para a rota de cadastro */}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-violet-500 hover:text-violet-400 font-semibold bg-transparent border-none p-0 cursor-pointer"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
