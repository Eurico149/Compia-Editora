import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users
const mockUsers = {
  'admin@compia.com': {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@compia.com',
    isAdmin: true,
  },
  'user@example.com': {
    id: 'user-1',
    name: 'Cliente Exemplo',
    email: 'user@example.com',
    isAdmin: false,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers[email as keyof typeof mockUsers];
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
