<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurantStore';
import type { TimeSlot } from '../types';

const store = useRestaurantStore();
const slots: TimeSlot[] = ['13:00', '14:00', '15:00', '20:00', '21:00'];
</script>

<template>
  <div class="time-selector">
    <h2>Selecciona la hora:</h2>
    <div class="slots">
      <button 
        v-for="slot in slots" 
        :key="slot"
        :class="{ active: store.activeTimeSlot === slot }"
        @click="store.setTimeSlot(slot)"
        :aria-pressed="store.activeTimeSlot === slot"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.slots { display: flex; gap: 10px; margin-bottom: 20px; }
button { padding: 10px 20px; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 4px; }
button.active { background: #42b883; color: white; border-color: #42b883; }
</style>