export type UserRole = 'coordinador' | 'encargado' | 'consulta';

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
