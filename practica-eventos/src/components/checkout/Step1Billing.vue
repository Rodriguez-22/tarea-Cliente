<script setup lang="ts">
import { Field, ErrorMessage, useFormValues, useForm } from 'vee-validate';
import { watch } from 'vue';

// Obtenemos la función para actualizar campos del formulario padre (<Form>)
const { setFieldValue } = useForm();
const values = useFormValues();

// Observador: Cuando el código postal cambie y tenga 5 dígitos, simulamos la llamada a la API
watch(() => values.value.postalCode, async (newCP) => {
  if (newCP && newCP.length === 5) {
    // Simulamos los CPs válidos que pide el PDF
    const mockDB: Record<string, { city: string, province: string }> = {
      '28001': { city: 'Madrid', province: 'Madrid' },
      '08001': { city: 'Barcelona', province: 'Barcelona' },
      '41001': { city: 'Sevilla', province: 'Sevilla' },
      '46001': { city: 'Valencia', province: 'Valencia' }
    };

    // Si el CP existe en nuestra "Base de datos", autocompletamos los campos
    if (mockDB[newCP]) {
      setFieldValue('city', mockDB[newCP].city);
      setFieldValue('province', mockDB[newCP].province);
    } else {
      // Si no existe, limpiamos para que el usuario lo rellene (o salte el error del Yup)
      setFieldValue('city', '');
      setFieldValue('province', '');
    }
  }
});
</script>

<template>
  <div class="step-grid">
    <div class="field-group">
      <label for="fullName">Nombre Completo *</label>
      <Field name="fullName" type="text" id="fullName" placeholder="Ej: Juan Pérez" />
      <ErrorMessage name="fullName" class="error" />
    </div>

    <div class="field-group">
      <label for="nif">NIF/CIF *</label>
      <Field name="nif" type="text" id="nif" placeholder="12345678Z" />
      <ErrorMessage name="nif" class="error" />
    </div>

    <div class="field-group">
      <label for="email">Email *</label>
      <Field name="email" type="email" id="email" />
      <ErrorMessage name="email" class="error" />
    </div>

    <div class="field-group">
      <label for="phone">Teléfono *</label>
      <Field name="phone" type="tel" id="phone" />
      <ErrorMessage name="phone" class="error" />
    </div>

    <div class="field-group full-width">
      <label for="address">Dirección *</label>
      <Field name="address" type="text" id="address" />
      <ErrorMessage name="address" class="error" />
    </div>

    <div class="field-group">
      <label for="postalCode">Código Postal (Autocompleta) *</label>
      <Field name="postalCode" type="text" id="postalCode" placeholder="Ej: 28001" />
      <ErrorMessage name="postalCode" class="error" />
    </div>

    <div class="field-group">
      <label for="city">Ciudad *</label>
      <Field name="city" type="text" id="city" />
      <ErrorMessage name="city" class="error" />
    </div>

    <div class="field-group">
      <label for="province">Provincia *</label>
      <Field name="province" type="text" id="province" />
      <ErrorMessage name="province" class="error" />
    </div>

    <div class="field-group">
      <label for="country">País *</label>
      <Field name="country" as="select" id="country">
        <option value="España">España</option>
        <option value="Portugal">Portugal</option>
        <option value="Francia">Francia</option>
      </Field>
      <ErrorMessage name="country" class="error" />
    </div>
  </div>
</template>

<style scoped>
.step-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.full-width {
  grid-column: span 2;
}
.field-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9em;
}
input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  font-size: 0.8em;
  margin-top: 4px;
}
</style>