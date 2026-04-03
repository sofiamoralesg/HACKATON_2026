import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { mockSurgeries } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Clock, User, MapPin, Shield, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SurgeryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const surgery = mockSurgeries.find((s) => s.id === id);

  if (!surgery) {
    return <Layout><p className="text-muted-foreground">Cirugía no encontrada.</p></Layout>;
  }

  const data = surgery.checklistData;

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{surgery.patient}</h1>
            <p className="text-sm text-muted-foreground">{surgery.procedure}</p>
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{surgery.room}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{surgery.time}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><User className="h-3.5 w-3.5" />{surgery.team.surgeon}</span>
          </div>
        </div>

        {!data ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-muted-foreground">Esta cirugía aún no tiene datos de checklist completados.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sign In */}
            <Section title="Sign In — Antes de la anestesia" completedAt={data.signIn.completedAt}>
              {data.signIn.questions.map((q) => (
                <AnswerRow key={q.id} text={q.text} answer={q.answer} answeredBy={q.answeredBy} answeredAt={q.answeredAt} />
              ))}
            </Section>

            {/* Time Out */}
            <Section title="Time Out — Antes de la incisión" completedAt={data.timeOut.completedAt}>
              {data.timeOut.questions.map((q) => (
                <AnswerRow key={q.id} text={q.text} answer={q.answer} answeredBy={q.answeredBy} answeredAt={q.answeredAt} />
              ))}

              {data.timeOut.instruments.length > 0 && (
                <div className="mt-4 rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Instrumentos registrados</p>
                  </div>
                  <div className="space-y-1">
                    {data.timeOut.instruments.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span className="text-foreground">{i.name}</span>
                        <span className="text-muted-foreground font-medium">{i.initialCount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Sign Out */}
            <Section title="Sign Out — Antes de cerrar" completedAt={data.signOut.completedAt}>
              {data.signOut.instruments.length > 0 && (
                <div className="rounded-lg border bg-background p-4 mb-3">
                  <p className="text-sm font-semibold text-foreground mb-3">Verificación de Instrumentos</p>
                  <div className="overflow-hidden rounded-lg border">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                      <span>Instrumento</span>
                      <span className="w-16 text-center">Inicial</span>
                      <span className="w-16 text-center">Final</span>
                      <span className="w-12 text-center">OK</span>
                    </div>
                    {data.signOut.instruments.map((i) => (
                      <div key={i.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center border-t px-4 py-2">
                        <span className="text-sm text-foreground">{i.name}</span>
                        <span className="w-16 text-center text-sm">{i.initialCount}</span>
                        <span className="w-16 text-center text-sm">{i.finalCount}</span>
                        <div className="w-12 flex justify-center">
                          {i.finalCount === i.initialCount
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

            {/* Signature */}
            {data.signature && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Firma Electrónica</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Responsable:</span> <span className="font-medium text-foreground">{data.signature.name}</span></div>
                  <div><span className="text-muted-foreground">Rol:</span> <span className="font-medium text-foreground">{data.signature.role}</span></div>
                  <div><span className="text-muted-foreground">Inicio:</span> <span className="font-medium text-foreground">{data.signature.startTime}</span></div>
                  <div><span className="text-muted-foreground">Fin:</span> <span className="font-medium text-foreground">{data.signature.endTime}</span></div>
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

function AnswerRow({ text, answer, answeredBy, answeredAt }: { text: string; answer?: 'si' | 'no' | null; answeredBy?: string; answeredAt?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-background p-3">
      {answer === 'si' ? (
        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-success" />
      ) : answer === 'no' ? (
        <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-warning" />
      ) : (
        <div className="h-5 w-5 mt-0.5 shrink-0 rounded-full border border-muted-foreground" />
      )}
      <div className="flex-1">
        <p className="text-sm text-foreground">{text}</p>
        {answeredBy && (
          <p className="mt-1 text-xs text-muted-foreground">{answeredBy} — {answeredAt}</p>
        )}
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        answer === 'si' ? 'bg-success/10 text-success' : answer === 'no' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
      }`}>
        {answer === 'si' ? 'Sí' : answer === 'no' ? 'No' : '—'}
      </span>
    </div>
  );
}
