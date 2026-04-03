import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Clock, User, MapPin, Shield, Wrench, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SurgeryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: surgery, isLoading: loadingSurgery } = useQuery({
    queryKey: ['surgery-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('surgeries').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: phases = [] } = useQuery({
    queryKey: ['phases', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('checklist_phases').select('*').eq('surgery_id', id!).order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: answers = [] } = useQuery({
    queryKey: ['answers', id],
    queryFn: async () => {
      const phaseIds = phases.map((p) => p.id);
      if (phaseIds.length === 0) return [];
      const { data, error } = await supabase.from('checklist_answers').select('*').in('phase_id', phaseIds);
      if (error) throw error;
      return data;
    },
    enabled: phases.length > 0,
  });

  const { data: instruments = [] } = useQuery({
    queryKey: ['instruments', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('instruments').select('*').eq('surgery_id', id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: signature } = useQuery({
    queryKey: ['signature', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('checklist_signatures').select('*').eq('surgery_id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (loadingSurgery) {
    return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!surgery) {
    return <Layout><p className="text-muted-foreground">Cirugía no encontrada.</p></Layout>;
  }

  const hasData = phases.length > 0;

  const getPhaseAnswers = (phaseName: string) => {
    const phase = phases.find((p) => p.phase === phaseName);
    if (!phase) return [];
    return answers.filter((a) => a.phase_id === phase.id);
  };

  const getPhaseCompletedAt = (phaseName: string) => {
    const phase = phases.find((p) => p.phase === phaseName);
    return phase?.completed_at ? new Date(phase.completed_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : undefined;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{surgery.patient}</h1>
            <p className="text-sm text-muted-foreground">{surgery.procedure_name}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{surgery.room}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{surgery.time}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><User className="h-3.5 w-3.5" />{surgery.surgeon}</span>
          </div>
        </div>

        {!hasData ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-muted-foreground">Esta cirugía aún no tiene datos de checklist completados.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sign In */}
            {getPhaseAnswers('sign-in').length > 0 && (
              <Section title="Sign In — Antes de la anestesia" completedAt={getPhaseCompletedAt('sign-in')}>
                {getPhaseAnswers('sign-in').map((q) => (
                  <AnswerRow key={q.id} text={q.question_text} answer={q.answer as 'si' | 'no' | null} answeredBy={q.answered_by || undefined} />
                ))}
              </Section>
            )}

            {/* Time Out */}
            {getPhaseAnswers('time-out').length > 0 && (
              <Section title="Time Out — Antes de la incisión" completedAt={getPhaseCompletedAt('time-out')}>
                {getPhaseAnswers('time-out').map((q) => (
                  <AnswerRow key={q.id} text={q.question_text} answer={q.answer as 'si' | 'no' | null} answeredBy={q.answered_by || undefined} />
                ))}
                {instruments.length > 0 && (
                  <div className="mt-4 rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Instrumentos registrados</p>
                    </div>
                    <div className="space-y-1">
                      {instruments.map((i) => (
                        <div key={i.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                          <span className="text-foreground">{i.name}</span>
                          <span className="text-muted-foreground font-medium">{i.initial_count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Sign Out */}
            {getPhaseAnswers('sign-out').length > 0 && (
              <Section title="Sign Out — Antes de cerrar" completedAt={getPhaseCompletedAt('sign-out')}>
                {getPhaseAnswers('sign-out').map((q) => (
                  <AnswerRow key={q.id} text={q.question_text} answer={q.answer as 'si' | 'no' | null} answeredBy={q.answered_by || undefined} />
                ))}
                {instruments.some((i) => i.final_count !== null) && (
                  <div className="rounded-lg border bg-background p-4 mt-3">
                    <p className="text-sm font-semibold text-foreground mb-3">Verificación de Instrumentos</p>
                    <div className="overflow-hidden rounded-lg border">
                      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                        <span>Instrumento</span>
                        <span className="w-16 text-center">Inicial</span>
                        <span className="w-16 text-center">Final</span>
                        <span className="w-12 text-center">OK</span>
                      </div>
                      {instruments.map((i) => (
                        <div key={i.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center border-t px-4 py-2">
                          <span className="text-sm text-foreground">{i.name}</span>
                          <span className="w-16 text-center text-sm">{i.initial_count}</span>
                          <span className="w-16 text-center text-sm">{i.final_count ?? '—'}</span>
                          <div className="w-12 flex justify-center">
                            {i.final_count === i.initial_count
                              ? <CheckCircle2 className="h-4 w-4 text-success" />
                              : <XCircle className="h-4 w-4 text-destructive" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Signature */}
            {signature && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Firma Electrónica</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Responsable:</span> <span className="font-medium text-foreground">{signature.signer_name}</span></div>
                  <div><span className="text-muted-foreground">Rol:</span> <span className="font-medium text-foreground capitalize">{signature.signer_role}</span></div>
                  <div><span className="text-muted-foreground">Inicio:</span> <span className="font-medium text-foreground">{signature.start_time}</span></div>
                  <div><span className="text-muted-foreground">Fin:</span> <span className="font-medium text-foreground">{signature.end_time}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" /> Checklist aceptado y firmado
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Section({ title, completedAt, children }: { title: string; completedAt?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {completedAt && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{completedAt}</span>}
      </div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}

function AnswerRow({ text, answer, answeredBy }: { text: string; answer?: 'si' | 'no' | null; answeredBy?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-background p-3">
      {answer === 'si' ? <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-success" /> : answer === 'no' ? <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-warning" /> : <div className="h-5 w-5 mt-0.5 shrink-0 rounded-full border border-muted-foreground" />}
      <div className="flex-1">
        <p className="text-sm text-foreground">{text}</p>
        {answeredBy && <p className="mt-1 text-xs text-muted-foreground">{answeredBy}</p>}
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${answer === 'si' ? 'bg-success/10 text-success' : answer === 'no' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
        {answer === 'si' ? 'Sí' : answer === 'no' ? 'No' : '—'}
      </span>
    </div>
  );
}
