export type UserRole = 'coordinador' | 'encargado' | 'consulta';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password: string;
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
  checklistData?: CompletedChecklist;
}

export interface ChecklistQuestion {
  id: string;
  text: string;
  answer?: 'si' | 'no' | null;
  answeredBy?: string;
  answeredAt?: string;
}

export interface InstrumentCount {
  id: string;
  name: string;
  initialCount: number;
  finalCount?: number;
}

export interface CompletedChecklist {
  signIn: { questions: ChecklistQuestion[]; completedAt?: string };
  timeOut: { questions: ChecklistQuestion[]; instruments: InstrumentCount[]; completedAt?: string };
  signOut: { instruments: InstrumentCount[]; completedAt?: string };
  signature?: {
    name: string;
    role: string;
    startTime: string;
    endTime: string;
    accepted: boolean;
  };
}

// Mock users with credentials
export const mockUsers: User[] = [
  { id: '1', name: 'Dr. Alejandro Vega', role: 'coordinador', email: 'coordinador@safeop.com', password: 'admin123' },
  { id: '2', name: 'Enf. Laura Torres', role: 'encargado', email: 'encargado@safeop.com', password: 'checklist123' },
  { id: '3', name: 'Dr. Carlos Mendoza', role: 'consulta', email: 'consulta@safeop.com', password: 'consulta123' },
  { id: '4', name: 'Enf. Carmen Díaz', role: 'encargado', email: 'carmen@safeop.com', password: 'checklist123' },
  { id: '5', name: 'Dr. Roberto Silva', role: 'consulta', email: 'silva@safeop.com', password: 'consulta123' },
];

// Doctors lists for dropdowns
export const surgeonsList = [
  'Dr. Carlos Mendoza',
  'Dr. Roberto Silva',
  'Dra. Patricia Gómez',
  'Dr. Alejandro Vega',
  'Dr. Fernando Castillo',
  'Dra. María Elena Ríos',
  'Dr. Andrés Herrera',
  'Dra. Claudia Morales',
];

export const anesthesiologistsList = [
  'Dra. Ana Ruiz',
  'Dr. Miguel Ángel Rojas',
  'Dr. Esteban Paredes',
  'Dra. Sofía Delgado',
  'Dr. Raúl Jiménez',
  'Dra. Valentina Ortega',
];

// Common surgical instruments
export const commonInstruments = [
  'Bisturí',
  'Pinza Kelly',
  'Pinza Kocher',
  'Pinza Allis',
  'Tijera Mayo',
  'Tijera Metzenbaum',
  'Porta agujas',
  'Separador Farabeuf',
  'Separador Richardson',
  'Pinza de campo (Backhaus)',
  'Gasas',
  'Compresas',
  'Agujas de sutura',
  'Clamp vascular',
  'Electrobisturí (punta)',
  'Cánula de aspiración (Yankauer)',
];

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
    checklistData: {
      signIn: {
        questions: [
          { id: 'si1', text: '¿El paciente confirmó su identidad, sitio quirúrgico y procedimiento?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:55' },
          { id: 'si2', text: '¿Está marcado el sitio quirúrgico?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:55' },
          { id: 'si3', text: '¿Se completó la verificación de seguridad anestésica?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:56' },
          { id: 'si4', text: '¿El pulsioxímetro está colocado y funcionando?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:56' },
          { id: 'si5', text: '¿El paciente tiene alergias conocidas?', answer: 'no', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:56' },
          { id: 'si6', text: '¿Existe riesgo de vía aérea difícil o aspiración?', answer: 'no', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:57' },
          { id: 'si7', text: '¿Existe riesgo de pérdida de sangre >500ml?', answer: 'no', answeredBy: 'Enf. Carmen Díaz', answeredAt: '13:57' },
        ],
        completedAt: '13:57',
      },
      timeOut: {
        questions: [
          { id: 'to1', text: '¿Todos los miembros del equipo se presentaron por nombre y función?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '14:00' },
          { id: 'to2', text: '¿Se confirmó la identidad del paciente, sitio quirúrgico y procedimiento?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '14:00' },
          { id: 'to3', text: '¿Se administró profilaxis antibiótica en los últimos 60 minutos?', answer: 'si', answeredBy: 'Enf. Carmen Díaz', answeredAt: '14:01' },
        ],
        instruments: [
          { id: 'inst1', name: 'Bisturí', initialCount: 2 },
          { id: 'inst2', name: 'Pinza Kelly', initialCount: 4 },
          { id: 'inst3', name: 'Gasas', initialCount: 20 },
          { id: 'inst4', name: 'Agujas de sutura', initialCount: 6 },
        ],
        completedAt: '14:02',
      },
      signOut: {
        instruments: [
          { id: 'inst1', name: 'Bisturí', initialCount: 2, finalCount: 2 },
          { id: 'inst2', name: 'Pinza Kelly', initialCount: 4, finalCount: 4 },
          { id: 'inst3', name: 'Gasas', initialCount: 20, finalCount: 20 },
          { id: 'inst4', name: 'Agujas de sutura', initialCount: 6, finalCount: 6 },
        ],
        completedAt: '15:30',
      },
      signature: {
        name: 'Enf. Carmen Díaz',
        role: 'encargado',
        startTime: '13:55',
        endTime: '15:32',
        accepted: true,
      },
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

// WHO-based checklist questions
export const signInQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'si1', text: '¿El paciente confirmó su identidad, sitio quirúrgico y procedimiento?' },
  { id: 'si2', text: '¿Está marcado el sitio quirúrgico?' },
  { id: 'si3', text: '¿Se completó la verificación de seguridad anestésica?' },
  { id: 'si4', text: '¿El pulsioxímetro está colocado y funcionando?' },
  { id: 'si5', text: '¿El paciente tiene alergias conocidas?' },
  { id: 'si6', text: '¿Existe riesgo de vía aérea difícil o aspiración?' },
  { id: 'si7', text: '¿Existe riesgo de pérdida de sangre >500ml (7ml/kg en niños)?' },
  { id: 'si8', text: '¿Se verificó el consentimiento informado firmado?' },
];

export const timeOutQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'to1', text: '¿Todos los miembros del equipo se presentaron por nombre y función?' },
  { id: 'to2', text: '¿Se confirmó la identidad del paciente, sitio quirúrgico y procedimiento?' },
  { id: 'to3', text: '¿Se administró profilaxis antibiótica en los últimos 60 minutos?' },
  { id: 'to4', text: '¿El cirujano revisó los pasos críticos, duración y pérdida de sangre esperada?' },
  { id: 'to5', text: '¿El anestesiólogo revisó si hay alguna preocupación específica del paciente?' },
  { id: 'to6', text: '¿Enfermería confirmó la esterilización y disponibilidad de equipamiento?' },
  { id: 'to7', text: '¿Están disponibles las imágenes diagnósticas necesarias?' },
];

export const signOutQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'so1', text: '¿Se confirmó verbalmente el procedimiento realizado?' },
  { id: 'so2', text: '¿Las muestras de tejido están correctamente etiquetadas?' },
  { id: 'so3', text: '¿Hubo algún problema con el equipamiento que deba reportarse?' },
  { id: 'so4', text: '¿Se revisaron los puntos clave para la recuperación del paciente?' },
];
