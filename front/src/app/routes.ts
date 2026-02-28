import { createBrowserRouter } from 'react-router';
import RootLayout from './pages/RootLayout';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import BookFormPage from './pages/BookFormPage';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'book/:bookId', Component: BookDetailPage },
      { path: 'signin', Component: SignInPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'admin', Component: AdminPage },
      { path: 'admin/books/new', Component: BookFormPage },
      { path: 'admin/books/edit/:bookId', Component: BookFormPage },
      { path: 'admin/orders/:orderId', Component: OrderDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
