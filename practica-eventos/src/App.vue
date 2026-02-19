<script setup lang="ts">
// Importamos los dos componentes principales del Ejercicio 3
import TimeSlotSelector from './components/TimeSlotSelector.vue';
import TableMap from './components/TableMap.vue';
</script>

<template>
  <div class="vuedining-app">
    <header class="app-header">
      <h1>VueDining - Gestión de Reservas</h1>
      <p>Selecciona una hora y haz clic en una mesa libre para reservar.</p>
    </header>

    <main class="app-main">
      <TimeSlotSelector />
      <TableMap />
    </main>
  </div>
</template>

<style scoped>
.vuedining-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.app-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.app-header p {
  color: #666;
  font-size: 1.1em;
}

.app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>