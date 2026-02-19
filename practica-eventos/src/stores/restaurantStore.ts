import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Table, Reservation, TimeSlot } from '../types';

export const useRestaurantStore = defineStore('restaurant', () => {
  // --- STATE ---
  const tables = ref<Table[]>([
    { id: 1, label: 'Mesa 1', capacity: 2, position: { x: 0, y: 0 } },
    { id: 2, label: 'Mesa 2', capacity: 4, position: { x: 120, y: 0 } },
    { id: 3, label: 'Mesa 3', capacity: 6, position: { x: 0, y: 120 } },
    { id: 4, label: 'Mesa 4', capacity: 4, position: { x: 120, y: 120 } },
  ]);
  
  const reservations = ref<Reservation[]>([]);
  const activeTimeSlot = ref<TimeSlot>('13:00');

  // --- ACTIONS ---
  const setTimeSlot = (slot: TimeSlot) => {
    activeTimeSlot.value = slot;
  };

  const isTableAvailable = (tableId: number): boolean => {
    return !reservations.value.some(
      (res) => res.tableId === tableId && res.timeSlot === activeTimeSlot.value
    );
  };

  const addReservation = (reservation: Reservation): boolean => {
    if (!isTableAvailable(reservation.tableId)) {
      console.error('La mesa ya está ocupada en este horario.');
      return false; // Evita overbooking (Test A)
    }
    reservations.value.push(reservation);
    return true;
  };

  return { 
    tables, 
    reservations, 
    activeTimeSlot, 
    setTimeSlot, 
    isTableAvailable, 
    addReservation 
  };
});