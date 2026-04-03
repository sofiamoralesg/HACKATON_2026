import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';
import { Shield, UserCog, ClipboardCheck, Eye } from 'lucide-react';
import { UserRole } from '@/lib/mockData';

const roles: { role: UserRole; label: string; desc: string; icon: typeof Shield }[] = [
  { role: 'coordinador', label: 'Coordinador / Admin', desc: 'Programa cirugías, asigna equipos y revisa reportes globales.', icon: UserCog },
  { role: 'encargado', label: 'Encargado del Checklist', desc: 'Ejecuta el checklist en quirófano durante la cirugía.', icon: ClipboardCheck },
  { role: 'consulta', label: 'Acceso de Consulta', desc: 'Cirujano o anestesiólogo. Ve cirugías asignadas e historial.', icon: Eye },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SafeOp</h1>
          <p className="mt-1 text-sm text-muted-foreground">Selecciona tu rol para ingresar</p>
        </div>

        <div className="space-y-3">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.button
                key={r.role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleLogin(r.role)}
                className="flex w-full items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
              >
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
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo MVP — Hackathon SafeOp
        </p>
      </motion.div>
    </div>
  );
}
