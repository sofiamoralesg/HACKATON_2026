export type UserRole = 'coordinador' | 'encargado' | 'consulta';

export interface ChecklistQuestion {
  id: string;
  text: string;
  answer?: 'si' | 'no' | null;
  answeredBy?: string;
  answeredAt?: string;
  followUpText?: string;
  followUpAnswer?: 'si' | 'no' | null;
  blockOnNo?: boolean;
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

// WHO Surgical Safety Checklist — Sign In (Before anesthesia induction)
export const signInQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'si1', text: '¿Ha confirmado el paciente su identidad, el sitio quirúrgico, el procedimiento y su consentimiento?' },
  { id: 'si2', text: '¿Se ha marcado el sitio quirúrgico? (Sí / No procede)' },
  { id: 'si3', text: '¿Se ha completado la comprobación de los aparatos de anestesia y la medicación anestésica?' },
  { id: 'si4', text: '¿Se ha colocado el pulsioxímetro al paciente y funciona?' },
  { id: 'si5', text: '¿Tiene el paciente alergias conocidas?', followUpText: '¿Son conocidas y tenidas en cuenta?' },
  { id: 'si6', text: '¿Tiene el paciente vía aérea difícil / riesgo de aspiración?', followUpText: '¿Hay materiales, equipos y ayuda disponible?' },
  { id: 'si7', text: '¿Tiene el paciente riesgo de hemorragia >500 ml (7 ml/kg en niños)?', followUpText: '¿Se ha previsto la disponibilidad de líquidos y dos vías IV o centrales?' },
];

// WHO Surgical Safety Checklist — Time Out (Before skin incision)
export const timeOutQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'to1', text: '¿Todos los miembros del equipo se han presentado por su nombre y función?' },
  { id: 'to2', text: '¿Se ha confirmado la identidad del paciente, el sitio quirúrgico y el procedimiento?' },
  { id: 'to3', text: '¿Se ha administrado profilaxis antibiótica en los últimos 60 minutos? (Sí / No procede)' },
  { id: 'to4', text: 'Cirujano: ¿Cuáles serán los pasos críticos o no sistematizados? ¿Cuánto durará la operación? ¿Cuál es la pérdida de sangre prevista?' },
  { id: 'to5', text: 'Anestesista: ¿Presenta el paciente algún problema específico?' },
  { id: 'to6', text: 'Equipo de enfermería: ¿Se ha confirmado la esterilidad (con resultados de los indicadores)? ¿Hay dudas o problemas relacionados con el instrumental y los equipos?' },
  { id: 'to7', text: '¿Pueden visualizarse las imágenes diagnósticas esenciales? (Sí / No procede)' },
];

// WHO Surgical Safety Checklist — Sign Out (Before patient leaves OR)
export const signOutQuestions: Omit<ChecklistQuestion, 'answer' | 'answeredBy' | 'answeredAt'>[] = [
  { id: 'so1', text: 'El enfermero confirma verbalmente: el nombre del procedimiento' },
  { id: 'so2', text: 'El enfermero confirma verbalmente: el recuento de instrumentos, gasas y agujas' },
  { id: 'so3', text: 'El enfermero confirma verbalmente: el etiquetado de las muestras (lectura de la etiqueta en voz alta, incluido el nombre del paciente)' },
  { id: 'so4', text: '¿Hay problemas que resolver relacionados con el instrumental y los equipos?' },
  { id: 'so5', text: 'Cirujano, anestesista y enfermero: ¿Cuáles son los aspectos críticos de la recuperación y el tratamiento del paciente?' },
];
