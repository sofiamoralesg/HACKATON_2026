import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserCog, ClipboardCheck, Eye, ArrowLeft, Mail, Lock, AlertCircle, UserPlus, LogIn, User } from 'lucide-react';
import type { UserRole } from '@/lib/authContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const roles: { role: UserRole; label: string; desc: string; icon: typeof Shield }[] = [
  { role: 'coordinador', label: 'Coordinador / Admin', desc: 'Programa cirugías, asigna equipos y revisa reportes globales.', icon: UserCog },
  { role: 'encargado', label: 'Encargado del Checklist', desc: 'Ejecuta el checklist en quirófano durante la cirugía.', icon: ClipboardCheck },
  { role: 'consulta', label: 'Acceso de Consulta', desc: 'Cirujano o anestesiólogo. Ve cirugías asignadas e historial.', icon: Eye },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, signUp, resetPassword } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError('');
    setSubmitting(true);

    if (isSignUp) {
      if (!name.trim()) { setError('Ingresa tu nombre completo.'); setSubmitting(false); return; }
      const result = await signUp(email, password, name, selectedRole);
      if (result.success) {
        toast.success('Cuenta creada exitosamente');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error al crear la cuenta');
      }
    } else {
      const result = await login(email, password, selectedRole);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    }
    setSubmitting(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Ingresa tu correo electrónico primero.');
      return;
    }
    const result = await resetPassword(email);
    if (result.success) {
      toast.success('Se ha enviado un enlace de recuperación a tu correo.');
    } else {
      toast.error(result.error || 'Error al enviar el enlace.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SafeOp</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedRole ? (isSignUp ? 'Crea tu cuenta' : 'Ingresa tus credenciales') : 'Selecciona tu rol para ingresar'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div key="roles" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              {roles.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.button key={r.role} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedRole(r.role)} className="flex w-full items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{r.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="credentials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <button onClick={() => { setSelectedRole(null); setError(''); setEmail(''); setPassword(''); setName(''); }} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Cambiar rol
              </button>

              <div className="mb-4 flex items-center gap-3 rounded-xl border bg-card p-3">
                {(() => {
                  const r = roles.find((r) => r.role === selectedRole)!;
                  const Icon = r.icon;
                  return (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Nombre completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="text" placeholder="Dr. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  {isSignUp ? <><UserPlus className="h-4 w-4" /> Crear Cuenta</> : <><LogIn className="h-4 w-4" /> Iniciar Sesión</>}
                </Button>

                {!isSignUp && (
                  <button type="button" onClick={handleForgotPassword} className="w-full text-center text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                )}

                <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs text-muted-foreground">SafeOp — Seguridad Quirúrgica</p>
      </motion.div>
    </div>
  );
}
