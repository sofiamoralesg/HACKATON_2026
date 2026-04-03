import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Layout from '@/components/Layout';
import { mockSurgeries, signInQuestions, timeOutQuestions, signOutQuestions, commonInstruments, ChecklistQuestion, InstrumentCount } from '@/lib/mockData';
import ChecklistSignIn from '@/components/checklist/ChecklistSignIn';
import ChecklistTimeOut from '@/components/checklist/ChecklistTimeOut';
import ChecklistSignOut from '@/components/checklist/ChecklistSignOut';
import ChecklistSignature from '@/components/checklist/ChecklistSignature';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const moments = [
  { key: 'sign-in', label: 'Sign In', subtitle: 'Antes de la anestesia' },
  { key: 'time-out', label: 'Time Out', subtitle: 'Antes de la incisión' },
  { key: 'sign-out', label: 'Sign Out', subtitle: 'Antes de cerrar' },
  { key: 'signature', label: 'Firma', subtitle: 'Firma electrónica' },
];

export default function Checklist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const surgery = mockSurgeries.find((s) => s.id === id);

  const [currentMoment, setCurrentMoment] = useState(0);
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [startTime] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));

  // Sign In state
  const [signInAnswers, setSignInAnswers] = useState<ChecklistQuestion[]>(
    signInQuestions.map((q) => ({ ...q, answer: null }))
  );

  // Time Out state
  const [timeOutAnswers, setTimeOutAnswers] = useState<ChecklistQuestion[]>(
    timeOutQuestions.map((q) => ({ ...q, answer: null }))
  );
  const [instruments, setInstruments] = useState<InstrumentCount[]>(
    commonInstruments.map((name, i) => ({ id: `inst-${i}`, name, initialCount: 0 }))
  );

  // Sign Out state
  const [signOutAnswers, setSignOutAnswers] = useState<ChecklistQuestion[]>(
    signOutQuestions.map((q) => ({ ...q, answer: null }))
  );
  const [finalInstruments, setFinalInstruments] = useState<InstrumentCount[]>([]);

  if (!surgery) {
    return <Layout><p className="text-muted-foreground">Cirugía no encontrada.</p></Layout>;
  }

  const allSignInAnswered = signInAnswers.every((q) => q.answer !== null);
  const allTimeOutAnswered = timeOutAnswers.every((q) => q.answer !== null);
  const usedInstruments = instruments.filter((i) => i.initialCount > 0);

  const allSignOutAnswered = signOutAnswers.every((q) => q.answer !== null);
  const instrumentsMatch = finalInstruments.length > 0 && finalInstruments.every((i) => i.finalCount === i.initialCount);

  const canAdvance = () => {
    if (currentMoment === 0) return allSignInAnswered;
    if (currentMoment === 1) return allTimeOutAnswered && usedInstruments.length > 0;
    if (currentMoment === 2) return allSignOutAnswered && instrumentsMatch;
    return true;
  };

  const handleAnswer = (list: ChecklistQuestion[], setList: React.Dispatch<React.SetStateAction<ChecklistQuestion[]>>, questionId: string, answer: 'si' | 'no') => {
    setList(list.map((q) =>
      q.id === questionId ? { ...q, answer, answeredBy: user?.name, answeredAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) } : q
    ));
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error('Debes completar todos los campos antes de continuar.');
      return;
    }

    const newCompleted = [...completed];
    newCompleted[currentMoment] = true;
    setCompleted(newCompleted);

    if (currentMoment === 1) {
      // Prepare instruments for sign-out comparison
      setFinalInstruments(usedInstruments.map((i) => ({ ...i, finalCount: undefined })));
    }

    if (currentMoment < 3) {
      setCurrentMoment(currentMoment + 1);
      toast.success(`${moments[currentMoment].label} completado`);
    }
  };

  const handleComplete = () => {
    toast.success('¡Cirugía completada con trazabilidad completa!');
    navigate('/dashboard');
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
      <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
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
            {i < 3 && <div className={`h-0.5 w-6 ${completed[i] ? 'bg-success' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Current moment header */}
      <motion.div key={currentMoment} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{moments[currentMoment].label}</h2>
        <p className="text-muted-foreground">{moments[currentMoment].subtitle}</p>
      </motion.div>

      {/* Content by moment */}
      {currentMoment === 0 && (
        <ChecklistSignIn
          questions={signInAnswers}
          onAnswer={(qId, ans) => handleAnswer(signInAnswers, setSignInAnswers, qId, ans)}
        />
      )}

      {currentMoment === 1 && (
        <ChecklistTimeOut
          questions={timeOutAnswers}
          onAnswer={(qId, ans) => handleAnswer(timeOutAnswers, setTimeOutAnswers, qId, ans)}
          instruments={instruments}
          onUpdateInstruments={setInstruments}
        />
      )}

      {currentMoment === 2 && (
        <ChecklistSignOut
          questions={signOutAnswers}
          onAnswer={(qId, ans) => handleAnswer(signOutAnswers, setSignOutAnswers, qId, ans)}
          instruments={finalInstruments}
          onUpdateFinalCount={(instId, count) => {
            setFinalInstruments((prev) => prev.map((i) => i.id === instId ? { ...i, finalCount: count } : i));
          }}
        />
      )}

      {currentMoment === 3 && (
        <ChecklistSignature
          userName={user?.name || ''}
          userRole={user?.role || ''}
          startTime={startTime}
          endTime={new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          onAccept={handleComplete}
        />
      )}

      {/* Actions */}
      {currentMoment < 3 && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => currentMoment > 0 ? setCurrentMoment(currentMoment - 1) : navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentMoment > 0 ? 'Anterior' : 'Volver'}
          </Button>

          <Button onClick={handleNext} className="gap-2" disabled={!canAdvance()}>
            Siguiente Momento
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Layout>
  );
}
