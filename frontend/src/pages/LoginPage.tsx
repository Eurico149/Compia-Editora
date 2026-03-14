import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle>
            {isForgot ? "Recuperar Senha" : isRegister ? "Criar Conta" : "Entrar"}
          </CardTitle>
          <CardDescription>
            {isForgot
              ? "Informe seu email para recuperar a senha"
              : isRegister
              ? "Crie sua conta na COMPIA Editora"
              : "Acesse sua conta na COMPIA Editora"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isForgot && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Aguarde..."
                : isForgot
                ? "Enviar email"
                : isRegister
                ? "Criar conta"
                : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {!isForgot && (
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-primary hover:underline"
              >
                {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
              </button>
            )}
            <br />
            <button
              type="button"
              onClick={() => { setIsForgot(!isForgot); setIsRegister(false); }}
              className="text-sm text-muted-foreground hover:underline"
            >
              {isForgot ? "Voltar ao login" : "Esqueci minha senha"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
