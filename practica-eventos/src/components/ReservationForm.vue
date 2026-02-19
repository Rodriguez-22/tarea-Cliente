<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import FormInput from './FormInput.vue';
import { useValidation } from '../composables/useValidation';
// Asegúrate de importar tus interfaces correctamente
import type { Reservation } from '../types/reservation';
import type { Table } from '../types/index'; // Ajusta la ruta si es necesario

// 1. PROPS para recibir la mesa
const props = defineProps<{
  selectedTable: Table;
}>();

// 2. EMITS para avisar al mapa
const emit = defineEmits<{
  (e: 'submit', formData: Reservation): void;
}>();

const formData = ref<Reservation>({
  name: '',
  nif: '',
  phone: '',
  email: '',
  eventType: '',
  eventDate: '',
  startTime: '',
  attendees: 1, // Iniciamos en 1
  catering: [],
  budget: '',
  comments: '',
  terms: false
});

const { errors, validateField } = useValidation();
let debounceTimeout: ReturnType<typeof setTimeout>;

const handleInput = (field: keyof typeof formData.value) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    validateField(field, String(formData.value[field]));
  }, 500);
};

const handleBlur = (field: keyof typeof formData.value) => {
  validateField(field, String(formData.value[field]));
};

const commentsLength = computed(() => formData.value.comments.trim().length);

onMounted(() => {
  const savedDraft = localStorage.getItem('reservationDraft');
  if (savedDraft) {
    formData.value = JSON.parse(savedDraft);
  }
});

watch(formData, (newVal) => {
  localStorage.setItem('reservationDraft', JSON.stringify(newVal));
}, { deep: true });

const clearForm = () => {
  formData.value = {
    name: '', nif: '', phone: '', email: '', eventType: '', 
    eventDate: '', startTime: '', attendees: 1, catering: [], 
    budget: '', comments: '', terms: false
  };
  errors.value = {};
  localStorage.removeItem('reservationDraft');
};

const submitForm = () => {
  const fieldsToValidate: (keyof typeof formData.value)[] = ['name', 'nif', 'phone', 'email'];
  fieldsToValidate.forEach(field => validateField(field, String(formData.value[field])));

  const hasErrors = Object.values(errors.value).some(err => err !== '');
  
  if (hasErrors || !formData.value.terms) {
    const firstError = document.querySelector('.is-invalid, .error-msg');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // 3. Validación estricta: No superar capacidad de la mesa
  if (formData.value.attendees > props.selectedTable.capacity) {
    alert(`Error: La mesa seleccionada solo admite un máximo de ${props.selectedTable.capacity} personas.`);
    return;
  }

  // 4. Emitimos los datos al componente padre
  emit('submit', formData.value);
  clearForm();
};
</script>

<template>
  <div class="form-container">
    <h2>Reservar {{ selectedTable.label }}</h2>
    <form @submit.prevent="submitForm" novalidate>
      
      <fieldset>
        <legend>Datos Personales</legend>
        <FormInput 
          id="name" label="Nombre completo" v-model="formData.name" 
          :error="errors.name" @input="handleInput('name')" @blur="handleBlur('name')" 
        />
        <FormInput 
          id="nif" label="NIF/NIE" v-model="formData.nif" 
          :error="errors.nif" @input="handleInput('nif')" @blur="handleBlur('nif')" 
        />
        <FormInput 
          id="phone" type="tel" label="Teléfono móvil" v-model="formData.phone" 
          :error="errors.phone" @input="handleInput('phone')" @blur="handleBlur('phone')" 
        />
        <FormInput 
          id="email" type="email" label="Correo Electrónico" v-model="formData.email" 
          :error="errors.email" @input="handleInput('email')" @blur="handleBlur('email')" 
        />
      </fieldset>

      <fieldset>
        <legend>Detalles del Evento</legend>
        
        <div class="input-group">
          <label for="eventType">Tipo de evento</label>
          <select id="eventType" v-model="formData.eventType" required>
            <option value="" disabled>Selecciona una opción</option>
            <option value="Boda">Boda</option>
            <option value="Cumpleaños">Cumpleaños</option>
            <option value="Corporativo">Corporativo</option>
            <option value="Conferencia">Conferencia</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div class="input-group">
          <label>Número de asistentes: {{ formData.attendees }} (Máx: {{ selectedTable.capacity }})</label>
          <div class="synced-inputs">
            <input type="range" min="1" :max="selectedTable.capacity" v-model.number="formData.attendees" />
            <input type="number" min="1" :max="selectedTable.capacity" v-model.number="formData.attendees" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Servicios Adicionales</legend>
        
        <div class="input-group">
          <label>Opciones de catering (Mínimo 1)</label>
          <div class="checkbox-group">
            <label><input type="checkbox" value="Vegetariano" v-model="formData.catering"> Menú vegetariano</label>
            <label><input type="checkbox" value="Vegano" v-model="formData.catering"> Menú vegano</label>
            <label><input type="checkbox" value="Barra libre" v-model="formData.catering"> Barra libre</label>
          </div>
        </div>

        <div class="input-group">
          <label>Presupuesto aproximado</label>
          <div class="radio-group">
            <label><input type="radio" value="Económico" v-model="formData.budget"> Económico (&lt; 2000€)</label>
            <label><input type="radio" value="Estándar" v-model="formData.budget"> Estándar (2000€ - 5000€)</label>
            <label><input type="radio" value="Premium" v-model="formData.budget"> Premium (5000€ - 10000€)</label>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Finalizar</legend>
        <div class="input-group">
          <label for="comments">Comentarios adicionales</label>
          <textarea id="comments" v-model="formData.comments" maxlength="500" rows="4"></textarea>
          <small :class="{ 'text-danger': commentsLength > 480 }">
            {{ commentsLength }} / 500 caracteres
          </small>
        </div>

        <div class="input-group checkbox-terms">
          <label>
            <input type="checkbox" v-model="formData.terms" required />
            Acepto los términos y condiciones para enviar
          </label>
        </div>
      </fieldset>

      <div class="actions">
        <button type="button" class="btn-clear" @click="clearForm">Limpiar Formulario</button>
        <button type="submit" class="btn-submit" :disabled="!formData.terms">Enviar Reserva</button>
      </div>

    </form>
    
    <div class="summary" v-if="formData.name">
      <h3>Resumen en vivo:</h3>
      <p><strong>Cliente:</strong> {{ formData.name }}</p>
      <p><strong>Asistentes:</strong> {{ formData.attendees }}</p>
      <p><strong>Presupuesto:</strong> {{ formData.budget || 'No seleccionado' }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Tus estilos originales intactos */
.form-container { 
  width: 100%; 
  margin: 0 auto; 
  padding: 30px; 
  background: var(--bg-card, #fff); 
  border-radius: var(--radius, 8px); 
  box-shadow: var(--shadow, 0 4px 6px rgba(0,0,0,0.1)); 
}
h2 { text-align: center; color: var(--primary, #2c3e50); margin-bottom: 30px; }
fieldset { 
  margin-bottom: 25px; 
  border: 1px solid var(--border, #ddd); 
  padding: 20px; 
  border-radius: 8px; 
  background-color: #f9fafb;
}
legend { 
  font-weight: 600; 
  color: var(--primary, #2c3e50); 
  background: var(--bg-card, #fff); 
  padding: 4px 12px; 
  border-radius: 20px; 
  border: 1px solid var(--border, #ddd);
}
.input-group { margin-bottom: 15px; display: flex; flex-direction: column; }
label { font-weight: 500; margin-bottom: 6px; color: var(--text-main, #333); }
.synced-inputs { display: flex; gap: 15px; align-items: center; }
.checkbox-group, .radio-group { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
.checkbox-terms { margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe; }
.actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
button { 
  padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
  font-weight: 600; font-size: 1rem; transition: transform 0.1s, opacity 0.2s; 
}
button:active { transform: scale(0.98); }
.btn-submit { background-color: var(--primary, #42b883); color: white; box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05)); }
.btn-submit:hover:not(:disabled) { background-color: var(--primary-hover, #3aa876); }
.btn-submit:disabled { background-color: #9ca3af; cursor: not-allowed; }
.btn-clear { background-color: transparent; color: var(--text-muted, #666); border: 1px solid var(--border, #ddd); }
.btn-clear:hover { background-color: #f3f4f6; color: var(--error, #dc3545); }
.summary { margin-top: 30px; padding: 20px; background: #ecfdf5; border-left: 5px solid var(--success, #10b981); border-radius: 0 8px 8px 0; }
</style>