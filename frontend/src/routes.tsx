import React from 'react';
import { createBrowserRouter } from "react-router";
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Catalog } from './components/Catalog';
import { ProductPage } from './components/ProductPage';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Login } from './components/Login';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EditorDashboard } from './components/dashboard/EditorDashboard';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { Register } from './components/Register';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "catalog", Component: Catalog },
      { path: "product/:id", Component: ProductPage },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "order-confirmation", Component: OrderConfirmation },
      { path: "*", Component: () => <div className="p-20 text-center text-white">Página não encontrada</div> },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { path: "admin", Component: AdminDashboard },
      { path: "admin/products", Component: EditorDashboard },
      { path: "admin/users", Component: AdminDashboard },
      { path: "editor", Component: EditorDashboard },
      { path: "customer", Component: CustomerDashboard },
      { path: "customer/orders", Component: CustomerDashboard },
      { path: "customer/downloads", Component: CustomerDashboard },
    ]
  }
]);