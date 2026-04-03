import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewSurgery() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patient: '', procedure: '', room: '', date: '', time: '', surgeon: '', anesthesiologist: '', checklistOwner: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cirugía programada exitosamente');
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Programar Cirugía</h1>
            <p className="text-sm text-muted-foreground">Complete los datos para crear una nueva cirugía</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nombre del Paciente</Label>
              <Input className="mt-1.5" placeholder="Nombre completo" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <Label>Procedimiento</Label>
              <Input className="mt-1.5" placeholder="Tipo de cirugía" value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} required />
            </div>
            <div>
              <Label>Sala / Quirófano</Label>
              <Select onValueChange={(v) => setForm({ ...form, room: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {['Quirófano 1', 'Quirófano 2', 'Quirófano 3', 'Quirófano 4'].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha</Label>
              <Input className="mt-1.5" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <Label>Hora</Label>
              <Input className="mt-1.5" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
            <div>
              <Label>Cirujano</Label>
              <Input className="mt-1.5" placeholder="Nombre del cirujano" value={form.surgeon} onChange={(e) => setForm({ ...form, surgeon: e.target.value })} required />
            </div>
            <div>
              <Label>Anestesiólogo</Label>
              <Input className="mt-1.5" placeholder="Nombre" value={form.anesthesiologist} onChange={(e) => setForm({ ...form, anesthesiologist: e.target.value })} required />
            </div>
            <div>
              <Label>Encargado del Checklist</Label>
              <Input className="mt-1.5" placeholder="Nombre" value={form.checklistOwner} onChange={(e) => setForm({ ...form, checklistOwner: e.target.value })} required />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>Cancelar</Button>
            <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Programar Cirugía</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
