// Opciones cerradas para los select y radio buttons
export type EventType = 'Boda' | 'Cumpleaños' | 'Corporativo' | 'Conferencia' | 'Otro' | '';
export type BudgetOption = 'Económico' | 'Estándar' | 'Premium' | 'Luxury' | '';
export type CateringOption = 'Menú vegetariano' | 'Menú vegano' | 'Barra libre' | 'Catering infantil' | 'Servicio de café';

// Interfaz principal del formulario de reserva
export interface Reservation {
  // Datos Personales
  name: string;
  nif: string;
  phone: string;
  email: string;

  // Detalles del Evento
  eventType: EventType;
  eventDate: string; // Formato YYYY-MM-DD
  startTime: string; // Formato HH:mm
  attendees: number;

  // Servicios Adicionales
  catering: CateringOption[];
  budget: BudgetOption;
  
  // Finalizar
  comments: string;
  terms: boolean;
}