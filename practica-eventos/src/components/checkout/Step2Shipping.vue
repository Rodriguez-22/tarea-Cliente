<script setup lang="ts">
import { Field, ErrorMessage, useFormValues } from 'vee-validate';

// Leemos los valores actuales del formulario global para saber si el checkbox está marcado
const values = useFormValues();
</script>

<template>
  <div class="step-container">
    <div class="checkbox-group">
      <label>
        <Field name="useSameAddress" type="checkbox" :value="true" />
        Misma dirección que facturación
      </label>
    </div>

    <div v-if="!values.useSameAddress" class="step-grid">
      <div class="field-group">
        <label>Nombre del destinatario *</label>
        <Field name="shipping.fullName" type="text" placeholder="Ej: María López" />
        <ErrorMessage name="shipping.fullName" class="error" />
      </div>

      <div class="field-group">
        <label>Teléfono de contacto *</label>
        <Field name="shipping.phone" type="tel" placeholder="Ej: 600123456" />
        <ErrorMessage name="shipping.phone" class="error" />
      </div>

      <div class="field-group full-width">
        <label>Dirección de envío *</label>
        <Field name="shipping.address" type="text" placeholder="Calle, número, piso..." />
        <ErrorMessage name="shipping.address" class="error" />
      </div>

      <div class="field-group">
        <label>Código Postal *</label>
        <Field name="shipping.postalCode" type="text" placeholder="Ej: 28001" />
        <ErrorMessage name="shipping.postalCode" class="error" />
      </div>

      <div class="field-group full-width">
        <label>Instrucciones de entrega (Opcional)</label>
        <Field name="shipping.instructions" as="textarea" rows="2" placeholder="Ej: Dejar al conserje..." />
        <ErrorMessage name="shipping.instructions" class="error" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-container { margin-bottom: 20px; }
.checkbox-group { margin-bottom: 20px; font-weight: bold; padding: 10px; background: #f0f8ff; border-radius: 5px; }
.step-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.full-width { grid-column: span 2; }
.field-group { display: flex; flex-direction: column; }
label { margin-bottom: 5px; font-size: 0.9em; font-weight: bold; }
input, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.error { color: red; font-size: 0.8em; margin-top: 4px; }
</style>