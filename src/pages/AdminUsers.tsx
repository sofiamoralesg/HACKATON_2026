import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, Users, Mail, Lock, User, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserRole } from '@/lib/authContext';

const roleLabels: Record<string, string> = {
  supervisor: 'Supervisor',
  coordinador: 'Coordinador',
  encargado: 'Encargado del Checklist',
  consulta: 'Acceso de Consulta',
};

export default function AdminUsers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: '' as string });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, name, email, created_at');
      if (pErr) throw pErr;
      const { data: roles, error: rErr } = await supabase.from('user_roles').select('user_id, role');
      if (rErr) throw rErr;

      return profiles.map((p) => {
        const roleRow = roles.find((r) => r.user_id === p.id);
        return { ...p, role: roleRow?.role || 'sin rol' };
      });
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { toast.error('Selecciona un rol'); return; }
    setSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (result.success) {
      toast.success(`Usuario ${form.name} creado exitosamente`);
      setForm({ email: '', password: '', name: '', role: '' });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } else {
      toast.error(result.error || 'Error al crear usuario');
    }
    setSubmitting(false);
  };

  if (user?.role !== 'coordinador') {
    return <Layout><p className="text-destructive font-medium">No tienes permisos para ver esta página.</p></Layout>;
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">Crea y administra los usuarios del sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <form onSubmit={handleCreate} className="rounded-xl border bg-card p-6 space-y-4 max-w-lg">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Crear nuevo usuario
            </h2>

            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Dr. Juan Pérez" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="usuario@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-10 pr-10" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="coordinador">Coordinador / Admin</SelectItem>
                  <SelectItem value="encargado">Encargado del Checklist</SelectItem>
                  <SelectItem value="consulta">Acceso de Consulta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Crear Usuario
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b bg-muted/50 px-5 py-3 text-xs font-medium text-muted-foreground">
            <span>Nombre</span>
            <span>Correo</span>
            <span>Rol</span>
            <span>Fecha</span>
          </div>
          {users.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground">No hay usuarios registrados.</div>
          ) : users.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 border-b px-5 py-4 last:border-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{u.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{u.email}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                u.role === 'coordinador' ? 'bg-primary/10 text-primary' : u.role === 'encargado' ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent-foreground'
              }`}>
                <Shield className="h-3 w-3" />
                {roleLabels[u.role] || u.role}
              </span>
              <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('es-ES')}</span>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
