import React, { useState } from 'react';
import { useNavigate } from 'react-router';
// Importando os mesmos componentes baseados no seu arquivo de login
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function Register() {
  const navigate = useNavigate();
  
  // Estados para gerenciar os dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você conectaria com a sua API ou Contexto para salvar o usuário
    console.log('Dados submetidos:', { nome, email, telefone, cpf, senha });
    
    // Exemplo: após o cadastro bem-sucedido, redirecionar para o login
    // navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-slate-800 bg-slate-900 p-10 shadow-2xl">
        <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded bg-violet-600 flex items-center justify-center font-bold text-white text-2xl">
            C
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Preencha seus dados para se cadastrar na COMPIA
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <form className="space-y-4" onSubmit={handleRegister}>
            <Input 
              type="text" 
              placeholder="Nome completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="tel" 
              placeholder="Telefone" 
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
            <Input 
              type="text" 
              placeholder="CPF" 
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
            <Input 
              type="password" 
              placeholder="Senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            
            <Button type="submit" className="w-full mt-2 bg-violet-600 hover:bg-violet-700">
              Cadastrar
            </Button>
          </form>
          
          <div className="login-link">
            <p className="text-center text-xs text-slate-500 mt-4">
              Já tem uma conta?{' '}
              {/* O botão abaixo navega de volta para a rota de login */}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-violet-500 hover:text-violet-400 font-semibold bg-transparent border-none p-0 cursor-pointer"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}