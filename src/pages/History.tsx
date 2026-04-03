import Layout from '@/components/Layout';
import { mockSurgeries } from '@/lib/mockData';
import { CheckCircle2, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function History() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Historial de Cirugías</h1>
        <p className="text-sm text-muted-foreground">Registro completo con trazabilidad</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 border-b bg-muted/50 px-5 py-3 text-xs font-medium text-muted-foreground">
          <span>Paciente</span>
          <span>Procedimiento</span>
          <span>Sala</span>
          <span>Hora</span>
          <span>Estado</span>
        </div>
        {mockSurgeries.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-4 border-b px-5 py-4 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{s.patient}</p>
              <p className="text-xs text-muted-foreground">{s.team.surgeon}</p>
            </div>
            <p className="text-sm text-muted-foreground">{s.procedure}</p>
            <span className="text-sm text-muted-foreground">{s.room}</span>
            <span className="text-sm text-muted-foreground">{s.time}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              s.status === 'completada'
                ? 'bg-success/10 text-success'
                : 'bg-primary/10 text-primary'
            }`}>
              {s.status === 'completada' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {s.status === 'completada' ? 'Completada' : 'Pendiente'}
            </span>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
