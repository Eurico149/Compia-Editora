import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { firebaseAuth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { auth as apiAuth } from "./api";
import { setToken, clearToken } from "./api";

interface User {
  uid: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncBackendUser = useCallback(async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      setUser(null);
      clearToken();
      setLoading(false);
      return;
    }

    try {
      const idToken = await fbUser.getIdToken();
      setToken(idToken);
      const me = (await apiAuth.me()) as User;
      setUser(me);
    } catch {
      setUser(null);
      clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
      setFirebaseUser(fbUser);
      syncBackendUser(fbUser);
    });
    return unsubscribe;
  }, [syncBackendUser]);

  // Refresh token periodically (Firebase tokens expire in 1h)
  useEffect(() => {
    if (!firebaseUser) return;
    const interval = setInterval(async () => {
      const token = await firebaseUser.getIdToken(true);
      setToken(token);
    }, 50 * 60 * 1000); // refresh every 50 min
    return () => clearInterval(interval);
  }, [firebaseUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    clearToken();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(firebaseAuth, email);
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, login, register, logout, resetPassword, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
