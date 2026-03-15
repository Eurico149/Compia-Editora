import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ShieldCheck, Zap, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { catalogo } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Produto {
  produto_uuid: string;
  name: string;
  image_url?: string;
  price: number;
  author: string;
  type: string;
  tags?: string[];
}

const typeColor: Record<string, string> = {
  fisico: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  ebook:  "bg-violet-500/10 text-violet-400 border-violet-500/30",
  kit:    "bg-amber-500/10 text-amber-400 border-amber-500/30",
};
const typeLabel: Record<string, string> = { fisico: "Físico", ebook: "E-book", kit: "Kit" };

const Index = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["catalogo"],
    queryFn: catalogo.getAll,
  });

  const produtos = (Array.isArray(data) ? data : []).slice(0, 4) as Produto[];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-36 border-b border-slate-800">
        {/* bg image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')" }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="container relative z-10 px-4 md:px-8 mx-auto flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
            <Zap className="h-3.5 w-3.5" />
            Editora de Tecnologia líder no Brasil
          </div>

          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Conhecimento Avançado para{" "}
            <span className="text-violet-400">Mentes Inovadoras</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
            A COMPIA Editora traz o que há de mais recente em tecnologia — desde fundamentos sólidos
            até as inovações que estão moldando o futuro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/catalogo">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 h-12">
                Explorar Catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-8"
              >
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="py-16 border-b border-slate-800 bg-slate-900">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Conteúdo de Qualidade",
                desc: "Publicações revisadas por especialistas líderes do mercado de tecnologia.",
                color: "text-violet-400",
                bg: "bg-violet-600/10",
              },
              {
                icon: Download,
                title: "Acesso Imediato",
                desc: "E-books e materiais digitais disponíveis para download instantâneo após a compra.",
                color: "text-blue-400",
                bg: "bg-blue-600/10",
              },
              {
                icon: ShieldCheck,
                title: "Compra Segura",
                desc: "Pagamento protegido com criptografia de ponta a ponta e suporte 24h.",
                color: "text-green-400",
                bg: "bg-green-600/10",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/50 p-7 hover:border-violet-500/30 transition-colors"
              >
                <div className={cn("mb-4 h-11 w-11 rounded-lg flex items-center justify-center", feat.bg)}>
                  <feat.icon className={cn("h-5 w-5", feat.color)} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ──────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-800 bg-slate-900">
        <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center">
          <div className="mb-4 h-14 w-14 rounded-2xl bg-violet-600/20 flex items-center justify-center">
            <Star className="h-7 w-7 text-violet-400" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-white">Pronto para começar?</h2>
          <p className="mb-8 max-w-xl text-slate-400">
            Explore nosso catálogo completo e encontre o material certo para o seu desenvolvimento profissional.
          </p>
          <Link to="/catalogo">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-10 h-12">
              Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Index;
