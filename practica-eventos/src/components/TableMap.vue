<script setup lang="ts">
import { ref } from 'vue';
import { useRestaurantStore } from '../stores/restaurantStore';
import TableComponent from './Table.vue';
import ReservationForm from './ReservationForm.vue';
import type { Table, Reservation } from '../types/index'; // Ajusta la ruta a tus tipos

const store = useRestaurantStore();
const selectedTable = ref<Table | null>(null);

const handleTableClick = (tableId: number) => {
  const table = store.tables.find(t => t.id === tableId);
  // Solo permitimos seleccionar si la mesa existe y está libre
  if (table && store.isTableAvailable(tableId)) {
    selectedTable.value = table;
  }
};

const getTableStatus = (tableId: number) => {
  if (!store.isTableAvailable(tableId)) return 'occupied';
  if (selectedTable.value?.id === tableId) return 'selected';
  return 'free';
};

const handleReservationSubmit = (formData: Reservation) => {
  if (!selectedTable.value) return;

  // Adaptamos los datos de tu formulario a la interfaz que espera Pinia
  const newReservation = {
    id: crypto.randomUUID(),
    tableId: selectedTable.value.id,
    timeSlot: store.activeTimeSlot,
    customerName: formData.name,
    customerEmail: formData.email,
    peopleCount: formData.attendees
  };

  if (store.addReservation(newReservation)) {
    alert(`¡Reserva confirmada para ${formData.name} en la ${selectedTable.value.label}!`);
    selectedTable.value = null; // Ocultamos el formulario
  }
};
</script>

<template>
  <div class="layout">
    
    <div class="map-container">
      <h3>Plano del Restaurante</h3>
      <div class="map">
        <TableComponent
          v-for="table in store.tables"
          :key="table.id"
          :tableData="table"
          :status="getTableStatus(table.id)"
          @click="handleTableClick"
        />
      </div>
    </div>

    <div class="form-container" v-if="selectedTable">
      <ReservationForm 
        :selectedTable="selectedTable" 
        @submit="handleReservationSubmit" 
      />
    </div>
    
  </div>
</template>

<style scoped>
.layout { 
  display: flex; 
  gap: 40px; 
  margin-top: 20px; 
  align-items: flex-start; 
  justify-content: center;
  flex-wrap: wrap; /* Para que en móviles el formulario caiga abajo */
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-container h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.map { 
  position: relative; 
  width: 320px; 
  height: 320px; 
  background: #f8f9fa; 
  border: 2px dashed #cbd5e1; 
  border-radius: 12px; 
}

.form-container { 
  width: 100%;
  max-width: 650px; /* Mantenemos el ancho original de tu formulario */
}
</style>