import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<UserRole, User> = {
  coordinador: { id: '1', name: 'Dr. Alejandro Vega', role: 'coordinador', email: 'coordinador@safeop.com' },
  encargado: { id: '2', name: 'Enf. Laura Torres', role: 'encargado', email: 'encargado@safeop.com' },
  consulta: { id: '3', name: 'Dr. Carlos Mendoza', role: 'consulta', email: 'consulta@safeop.com' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => setUser(mockUsers[role]);
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
