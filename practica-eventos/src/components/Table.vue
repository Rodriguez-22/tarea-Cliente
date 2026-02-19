<script setup lang="ts">
import { computed } from 'vue';
import type { Table } from '../types';

const props = defineProps<{
  tableData: Table;
  status: 'free' | 'occupied' | 'selected';
}>();

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

// Genera un texto dinámico para lectores de pantalla
const ariaLabelText = computed(() => {
  const estadoTexto = props.status === 'free' ? 'Libre' 
                    : props.status === 'occupied' ? 'Ocupada' 
                    : 'Seleccionada';
  return `${props.tableData.label}, para ${props.tableData.capacity} personas, estado: ${estadoTexto}`;
});
</script>

<template>
  <button 
    class="table-btn"
    :class="status"
    :style="{ left: `${tableData.position.x}px`, top: `${tableData.position.y}px` }"
    :aria-label="ariaLabelText"
    :disabled="status === 'occupied'"
    @click="emit('click', tableData.id)"
  >
    <span aria-hidden="true">{{ tableData.capacity }} 🪑</span>
  </button>
</template>

<style scoped>
.table-btn {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
}
.table-btn:focus { outline: 3px solid #005fcc; outline-offset: 2px; }
.free { background-color: #e6ffe6; border-color: #4caf50; }
.free:hover { background-color: #c8e6c9; }
.occupied { background-color: #ffe6e6; border-color: #f44336; cursor: not-allowed; opacity: 0.7; }
.selected { background-color: #e3f2fd; border-color: #2196f3; box-shadow: 0 0 10px rgba(33,150,243,0.5); }
</style>