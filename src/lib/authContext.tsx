import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupaUser } from '@supabase/supabase-js';

export type UserRole = 'coordinador' | 'encargado' | 'consulta';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function loadAppUser(supaUser: SupaUser): Promise<AppUser | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', supaUser.id)
      .single();

    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supaUser.id)
      .single();

    if (!profile || !roleRow) return null;

    return {
      id: supaUser.id,
      name: profile.name,
      email: profile.email,
      role: roleRow.role as UserRole,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const appUser = await loadAppUser(session.user);
      setUser(appUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Set up listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const appUser = await loadAppUser(session.user);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check initial session
    refreshUser();

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  const login = async (email: string, password: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'Correo o contraseña incorrectos.' };

    // Verify role matches
    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    if (!roleRow || roleRow.role !== role) {
      await supabase.auth.signOut();
      return { success: false, error: 'El rol seleccionado no corresponde a este usuario.' };
    }

    // Wait for onAuthStateChange to set the user — just return success
    // The useEffect in Login.tsx will handle navigation when user state updates
    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'No se pudo crear el usuario.' };

    // Assign role using security definer function
    const { error: roleError } = await supabase.rpc('assign_user_role', {
      _user_id: data.user.id,
      _role: role,
    });
    if (roleError) return { success: false, error: 'Error al asignar el rol: ' + roleError.message };

    // Refresh user data to pick up the new role
    await refreshUser();
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
