<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import FormInput from './FormInput.vue';
import { useValidation } from '../composables/useValidation';
import type { Reservation } from '../types/reservation';

// Aplicamos el tipado estricto <Reservation>
const formData = ref<Reservation>({
  name: '',
  nif: '',
  phone: '',
  email: '',
  eventType: '',
  eventDate: '',
  startTime: '',
  attendees: 10,
  catering: [],
  budget: '',
  comments: '',
  terms: false
});

const { errors, validateField } = useValidation();
let debounceTimeout: ReturnType<typeof setTimeout>;

// Validación en tiempo real con debounce de 500ms
const handleInput = (field: keyof typeof formData.value) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    validateField(field, String(formData.value[field]));
  }, 500);
};

// Validación al perder el foco (blur)
const handleBlur = (field: keyof typeof formData.value) => {
  validateField(field, String(formData.value[field]));
};

// Cálculo de caracteres para los comentarios (Máximo 500)
const commentsLength = computed(() => formData.value.comments.trim().length);

// Persistencia en localStorage
onMounted(() => {
  const savedDraft = localStorage.getItem('reservationDraft');
  if (savedDraft) {
    formData.value = JSON.parse(savedDraft);
  }
});

watch(formData, (newVal) => {
  localStorage.setItem('reservationDraft', JSON.stringify(newVal));
}, { deep: true });

// Limpiar formulario
const clearForm = () => {
  formData.value = {
    name: '', nif: '', phone: '', email: '', eventType: '', 
    eventDate: '', startTime: '', attendees: 10, catering: [], 
    budget: '', comments: '', terms: false
  };
  errors.value = {};
  localStorage.removeItem('reservationDraft');
};

// Enviar formulario
const submitForm = () => {
  // Forzar validación de campos principales
  const fieldsToValidate: (keyof typeof formData.value)[] = ['name', 'nif', 'phone', 'email'];
  fieldsToValidate.forEach(field => validateField(field, String(formData.value[field])));

  const hasErrors = Object.values(errors.value).some(err => err !== '');
  
  if (hasErrors || !formData.value.terms) {
    // Scroll al primer error
    const firstError = document.querySelector('.is-invalid, .error-msg');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  alert('¡Reserva validada y enviada con éxito!');
  clearForm();
};
</script>

<template>
  <div class="form-container">
    <h2>Reserva de Eventos</h2>
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
          <label>Número de asistentes: {{ formData.attendees }}</label>
          <div class="synced-inputs">
            <input type="range" min="10" max="500" v-model.number="formData.attendees" />
            <input type="number" min="10" max="500" v-model.number="formData.attendees" />
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
.form-container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
fieldset { margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
legend { font-weight: bold; padding: 0 5px; }
.input-group { margin-bottom: 15px; display: flex; flex-direction: column; }
.synced-inputs { display: flex; gap: 10px; align-items: center; }
.checkbox-group, .radio-group { display: flex; flex-direction: column; gap: 5px; margin-top: 5px; }
.checkbox-terms { margin-top: 20px; font-weight: bold; }
.text-danger { color: red; }
.actions { display: flex; justify-content: space-between; margin-top: 20px; }
button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.btn-submit { background-color: #4CAF50; color: white; }
.btn-submit:disabled { background-color: #cccccc; cursor: not-allowed; }
.btn-clear { background-color: #f44336; color: white; }
.summary { margin-top: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50; }
</style>