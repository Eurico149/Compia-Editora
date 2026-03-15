import { Link } from "react-router-dom";
import { Mail, Phone, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="container px-4 md:px-8 mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="h-8 w-8 rounded bg-violet-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-tight">COMPIA Editora</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Editora especializada em livros técnicos de alta qualidade nas áreas de
            Inteligência Artificial, Blockchain e Segurança da Informação.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-slate-100 text-sm uppercase tracking-wider">Navegação</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/" className="hover:text-violet-400 transition-colors">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-violet-400 transition-colors">Catálogo</Link></li>
            <li><Link to="/login" className="hover:text-violet-400 transition-colors">Entrar / Cadastrar</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-slate-100 text-sm uppercase tracking-wider">Contato</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-violet-500 flex-shrink-0" />
              <span>contato@compia.com.br</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-violet-500 flex-shrink-0" />
              <span>+55 (11) 9999-9999</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container px-4 md:px-8 mx-auto mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <p>© {new Date().getFullYear()} COMPIA Editora. Todos os direitos reservados.</p>
        <p>Feito com ♥ para desenvolvedores</p>
      </div>
    </footer>
  );
}
