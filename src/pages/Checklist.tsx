import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Layout from '@/components/Layout';
import { mockSurgeries, signInItems, timeOutItems, signOutItems, ChecklistItem } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, Circle, AlertTriangle, ArrowRight, ArrowLeft, User, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const moments = [
  { key: 'sign-in', label: 'Sign In', subtitle: 'Antes de la anestesia', color: 'bg-primary', items: signInItems },
  { key: 'time-out', label: 'Time Out', subtitle: 'Antes de la incisión', color: 'bg-warning', items: timeOutItems },
  { key: 'sign-out', label: 'Sign Out', subtitle: 'Antes de cerrar', color: 'bg-accent', items: signOutItems },
];

export default function Checklist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const surgery = mockSurgeries.find((s) => s.id === id);

  const [currentMoment, setCurrentMoment] = useState(0);
  const [items, setItems] = useState<ChecklistItem[][]>(moments.map((m) => m.items.map((i) => ({ ...i }))));
  const [completed, setCompleted] = useState([false, false, false]);

  if (!surgery) {
    return <Layout><p className="text-muted-foreground">Cirugía no encontrada.</p></Layout>;
  }

  const moment = moments[currentMoment];
  const currentItems = items[currentMoment];
  const allConfirmed = currentItems.every((item) => item.confirmed && (!item.hasSubQuestion || item.subConfirmed));

  const toggleItem = (itemId: string) => {
    setItems((prev) => {
      const copy = prev.map((arr) => arr.map((i) => ({ ...i })));
      const item = copy[currentMoment].find((i) => i.id === itemId);
      if (item) {
        item.confirmed = !item.confirmed;
        item.confirmedBy = item.confirmed ? user?.name : undefined;
        item.confirmedAt = item.confirmed ? new Date().toLocaleTimeString('es-ES') : undefined;
      }
      return copy;
    });
  };

  const toggleSubItem = (itemId: string) => {
    setItems((prev) => {
      const copy = prev.map((arr) => arr.map((i) => ({ ...i })));
      const item = copy[currentMoment].find((i) => i.id === itemId);
      if (item) item.subConfirmed = !item.subConfirmed;
      return copy;
    });
  };

  const handleNext = () => {
    if (!allConfirmed) {
      toast.error('Todos los ítems deben ser confirmados antes de continuar', {
        description: 'El sistema no permite avanzar sin completar el checklist.',
        icon: <AlertTriangle className="h-5 w-5" />,
      });
      return;
    }

    const newCompleted = [...completed];
    newCompleted[currentMoment] = true;
    setCompleted(newCompleted);

    if (currentMoment < 2) {
      setCurrentMoment(currentMoment + 1);
      toast.success(`${moment.label} completado`);
    } else {
      toast.success('¡Cirugía completada con trazabilidad completa!');
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      {/* Surgery info bar */}
      <div className="mb-6 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold text-foreground">{surgery.patient}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{surgery.procedure}</span>
          <span className="text-muted-foreground">•</span>
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{surgery.room}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{surgery.time}</span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {moments.map((m, i) => (
          <div key={m.key} className="flex items-center gap-2">
            <div className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
              i === currentMoment
                ? 'bg-primary text-primary-foreground'
                : completed[i]
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            }`}>
              {completed[i] ? <CheckCircle2 className="h-4 w-4" /> : <span className="font-bold">{i + 1}</span>}
              <span className="hidden sm:inline">{m.label}</span>
            </div>
            {i < 2 && <div className={`h-0.5 w-6 ${completed[i] ? 'bg-success' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Current moment header */}
      <motion.div
        key={currentMoment}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground">{moment.label}</h2>
        <p className="text-muted-foreground">{moment.subtitle}</p>
      </motion.div>

      {/* Checklist items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMoment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          {currentItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border bg-card p-4 transition-all ${item.confirmed ? 'border-success/30' : ''}`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                {item.confirmed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.confirmed ? 'text-foreground' : 'text-foreground'}`}>
                    {item.text}
                  </p>
                  {item.confirmedBy && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-success">
                      <User className="h-3 w-3" />
                      {item.confirmedBy} — {item.confirmedAt}
                    </p>
                  )}
                </div>
              </button>

              {item.hasSubQuestion && item.confirmed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-8 mt-3 border-l-2 border-primary/20 pl-4"
                >
                  <button
                    onClick={() => toggleSubItem(item.id)}
                    className="flex items-start gap-3 text-left"
                  >
                    {item.subConfirmed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    )}
                    <p className="text-sm text-muted-foreground">{item.subQuestion}</p>
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => currentMoment > 0 ? setCurrentMoment(currentMoment - 1) : navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentMoment > 0 ? 'Anterior' : 'Volver'}
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentItems.filter((i) => i.confirmed).length}/{currentItems.length} confirmados
        </div>

        <Button
          onClick={handleNext}
          className="gap-2"
          disabled={!allConfirmed}
        >
          {currentMoment < 2 ? 'Siguiente Momento' : 'Completar Cirugía'}
          {currentMoment < 2 ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        </Button>
      </div>
    </Layout>
  );
}
