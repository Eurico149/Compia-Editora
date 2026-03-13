import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-600 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
