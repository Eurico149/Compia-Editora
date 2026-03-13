import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="container px-4 md:px-8 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-violet-600 flex items-center justify-center font-bold text-white">C</div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">COMPIA</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Editora especializada em livros técnicos de alta qualidade nas áreas de Inteligência Artificial, Blockchain e Segurança da Informação.
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-slate-100">Contato</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-violet-500" />
              <span>contato@compia.com.br</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-violet-500" />
              <span>+55 (11) 9999-9999</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
