import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || (!isForgot && !password.trim())) return;
    setLoading(true);
    try {
      if (isForgot) {
        await resetPassword(email.trim());
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
        setIsForgot(false);
      } else if (isRegister) {
        await register(email.trim(), password);
        toast.success("Conta criada com sucesso!");
        navigate("/");
      } else {
        await login(email.trim(), password);
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Email ou senha inválidos.");
      } else if (msg.includes("email-already-in-use")) {
        toast.error("Este email já está cadastrado.");
      } else if (msg.includes("weak-password")) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-violet-600 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isForgot ? "Recuperar Senha" : isRegister ? "Criar Conta" : "Bem-vindo de volta"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isForgot
              ? "Informe seu email para recuperar a senha"
              : isRegister
              ? "Crie sua conta na COMPIA Editora"
              : "Acesse sua conta na COMPIA Editora"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          {!isForgot && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            disabled={loading}
          >
            {loading
              ? "Aguarde..."
              : isForgot
              ? "Enviar email"
              : isRegister
              ? "Criar conta"
              : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center space-y-3">
          {!isForgot && (
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
            </button>
          )}
          <div>
            <button
              type="button"
              onClick={() => { setIsForgot(!isForgot); setIsRegister(false); }}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              {isForgot ? "Voltar ao login" : "Esqueci minha senha"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
