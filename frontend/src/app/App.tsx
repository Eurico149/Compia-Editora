import React from 'react';
import '../styles/index.css';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from '../routes';
import { StoreProvider } from '../context/StoreContext';

export default function App() {
  return (
    <StoreProvider>
      <Toaster position="top-right" theme="dark" richColors />
      <RouterProvider router={router} />
    </StoreProvider>
  );
}
