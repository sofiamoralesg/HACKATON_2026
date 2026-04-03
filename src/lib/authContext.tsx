import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, mockUsers } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): { success: boolean; error?: string } => {
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Correo o contraseña incorrectos.' };
    if (found.role !== role) return { success: false, error: 'El rol seleccionado no corresponde a este usuario.' };
    setUser(found);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
