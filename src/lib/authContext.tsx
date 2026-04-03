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

async function loadAppUser(userId: string): Promise<AppUser | null> {
  const [profileRes, roleRes] = await Promise.all([
    supabase.from('profiles').select('name, email').eq('id', userId).single(),
    supabase.from('user_roles').select('role').eq('user_id', userId).single(),
  ]);

  if (profileRes.error || roleRes.error || !profileRes.data || !roleRes.data) {
    console.error('loadAppUser failed:', { profileErr: profileRes.error, roleErr: roleRes.error });
    return null;
  }

  return {
    id: userId,
    name: profileRes.data.name,
    email: profileRes.data.email,
    role: roleRes.data.role as UserRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase auth
        setTimeout(async () => {
          if (!mounted) return;
          const appUser = await loadAppUser(session.user.id);
          if (mounted) {
            setUser(appUser);
            setLoading(false);
          }
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const appUser = await loadAppUser(session.user.id);
        if (mounted) {
          setUser(appUser);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'Correo o contraseña incorrectos.' };

    // Verify role
    const { data: roleRow, error: roleErr } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    if (roleErr || !roleRow || roleRow.role !== role) {
      await supabase.auth.signOut();
      return { success: false, error: 'El rol seleccionado no corresponde a este usuario.' };
    }

    // Directly set user without waiting for onAuthStateChange
    const appUser = await loadAppUser(data.user.id);
    if (appUser) {
      setUser(appUser);
      return { success: true };
    }
    return { success: false, error: 'Error al cargar perfil de usuario.' };
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
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

    // Directly set user
    const appUser = await loadAppUser(data.user.id);
    if (appUser) {
      setUser(appUser);
      return { success: true };
    }
    return { success: false, error: 'Error al cargar perfil de usuario.' };
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
