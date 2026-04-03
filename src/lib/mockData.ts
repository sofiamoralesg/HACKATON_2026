export type UserRole = 'coordinador' | 'encargado' | 'consulta';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Surgery {
  id: string;
  patient: string;
  procedure: string;
  room: string;
  date: string;
  time: string;
  status: 'programada' | 'sign-in' | 'time-out' | 'sign-out' | 'completada';
  team: {
    surgeon: string;
    anesthesiologist: string;
    checklistOwner: string;
  };
  checklist?: {
    signIn?: ChecklistMoment;
    timeOut?: ChecklistMoment;
    signOut?: ChecklistMoment;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  confirmed: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
  hasSubQuestion?: boolean;
  subQuestion?: string;
  subConfirmed?: boolean;
}

export interface ChecklistMoment {
  items: ChecklistItem[];
  completedAt?: string;
  completedBy?: string;
}

export const mockSurgeries: Surgery[] = [
  {
    id: '1',
    patient: 'María García López',
    procedure: 'Colecistectomía laparoscópica',
    room: 'Quirófano 3',
    date: '2026-04-03',
    time: '08:00',
    status: 'programada',
    team: {
      surgeon: 'Dr. Carlos Mendoza',
      anesthesiologist: 'Dra. Ana Ruiz',
      checklistOwner: 'Enf. Laura Torres',
    },
  },
  {
    id: '2',
    patient: 'Juan Pérez Martínez',
    procedure: 'Apendicectomía',
    room: 'Quirófano 1',
    date: '2026-04-03',
    time: '10:30',
    status: 'sign-in',
    team: {
      surgeon: 'Dr. Roberto Silva',
      anesthesiologist: 'Dr. Miguel Ángel Rojas',
      checklistOwner: 'Enf. Laura Torres',
    },
  },
  {
    id: '3',
    patient: 'Ana Sofía Ramírez',
    procedure: 'Hernioplastía inguinal',
    room: 'Quirófano 2',
    date: '2026-04-03',
    time: '14:00',
    status: 'completada',
    team: {
      surgeon: 'Dra. Patricia Gómez',
      anesthesiologist: 'Dra. Ana Ruiz',
      checklistOwner: 'Enf. Carmen Díaz',
    },
  },
  {
    id: '4',
    patient: 'Luis Fernando Castro',
    procedure: 'Artroscopia de rodilla',
    room: 'Quirófano 4',
    date: '2026-04-03',
    time: '16:00',
    status: 'programada',
    team: {
      surgeon: 'Dr. Carlos Mendoza',
      anesthesiologist: 'Dr. Miguel Ángel Rojas',
      checklistOwner: 'Enf. Laura Torres',
    },
  },
];

export const signInItems: ChecklistItem[] = [
  { id: 'si1', text: '¿El paciente confirmó su identidad, procedimiento y consentimiento?', confirmed: false },
  { id: 'si2', text: '¿El sitio quirúrgico está marcado?', confirmed: false },
  { id: 'si3', text: '¿La máquina de anestesia y medicación fueron verificadas?', confirmed: false },
  { id: 'si4', text: '¿El paciente tiene alergias conocidas?', confirmed: false, hasSubQuestion: true, subQuestion: '¿Están documentadas y el equipo las conoce?', subConfirmed: false },
  { id: 'si5', text: '¿Tiene riesgo de vía aérea difícil?', confirmed: false, hasSubQuestion: true, subQuestion: '¿Hay equipo de contingencia disponible?', subConfirmed: false },
  { id: 'si6', text: '¿Tiene riesgo de pérdida de sangre mayor a 500ml?', confirmed: false, hasSubQuestion: true, subQuestion: '¿Hay acceso IV y líquidos preparados?', subConfirmed: false },
];

export const timeOutItems: ChecklistItem[] = [
  { id: 'to1', text: 'Todos los miembros se presentaron por nombre y rol', confirmed: false },
  { id: 'to2', text: 'Confirmación del procedimiento, paciente y sitio de incisión', confirmed: false },
  { id: 'to3', text: '¿Se administró profilaxis antibiótica en los últimos 60 minutos?', confirmed: false },
  { id: 'to4', text: 'Cirujano confirma: pasos críticos, duración estimada, pérdida de sangre esperada', confirmed: false },
  { id: 'to5', text: 'Anestesiólogo confirma: preocupaciones específicas del paciente', confirmed: false },
  { id: 'to6', text: 'Enfermería confirma: esterilización verificada, equipamiento sin problemas', confirmed: false },
  { id: 'to7', text: '¿Están disponibles las imágenes diagnósticas necesarias?', confirmed: false },
];

export const signOutItems: ChecklistItem[] = [
  { id: 'so1', text: 'Confirmación verbal del nombre del procedimiento realizado', confirmed: false },
  { id: 'so2', text: 'Conteo de instrumentos — completo y correcto', confirmed: false },
  { id: 'so3', text: 'Conteo de gasas — completo y correcto', confirmed: false },
  { id: 'so4', text: 'Conteo de agujas — completo y correcto', confirmed: false },
  { id: 'so5', text: '¿Las muestras de tejido están etiquetadas con el nombre del paciente?', confirmed: false },
  { id: 'so6', text: '¿Hay problemas con equipamiento que reportar?', confirmed: false },
  { id: 'so7', text: '¿El equipo revisó los puntos clave para la recuperación del paciente?', confirmed: false },
];
