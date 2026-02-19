<script setup lang="ts">
import { Field, ErrorMessage, useFormValues } from 'vee-validate';
import { ref, watch } from 'vue';
import { getCardType, luhnCheck } from '../../utils/creditCard';

const values = useFormValues();
const cardType = ref('');
const isCardValid = ref<boolean | null>(null);

// Observamos el número de tarjeta en tiempo real para aplicar el algoritmo de Luhn [cite: 192, 196]
watch(() => values.value.cardNumber, (newVal) => {
  if (newVal && typeof newVal === 'string') {
    cardType.value = getCardType(newVal);
    isCardValid.value = newVal.length > 12 ? luhnCheck(newVal) : null;
  }
});
</script>

<template>
  <div class="step-container">
    <div class="payment-methods">
      <label><Field name="paymentMethod" type="radio" value="creditCard" /> Tarjeta de Crédito/Débito</label>
      <label><Field name="paymentMethod" type="radio" value="paypal" /> PayPal</label>
      <label><Field name="paymentMethod" type="radio" value="transfer" /> Transferencia Bancaria</label>
      <label><Field name="paymentMethod" type="radio" value="bizum" /> Bizum</label>
    </div>
    <ErrorMessage name="paymentMethod" class="error block-error" />

    <div v-if="values.paymentMethod === 'creditCard'" class="payment-details card-grid">
      <div class="field-group full-width">
        <label>Número de Tarjeta ({{ cardType }})</label>
        <Field name="cardNumber" type="text" placeholder="XXXX XXXX XXXX XXXX" />
        <span v-if="isCardValid === true" class="valid-luhn">✅ Tarjeta válida</span>
        <span v-if="isCardValid === false" class="error">❌ Número inválido (Algoritmo Luhn)</span>
        <ErrorMessage name="cardNumber" class="error" />
      </div>

      <div class="field-group">
        <label>Titular de la tarjeta</label>
        <Field name="cardName" type="text" placeholder="Como aparece en la tarjeta" />
        <ErrorMessage name="cardName" class="error" />
      </div>

      <div class="field-group row-group">
        <div>
          <label>Expiración (MM/YY)</label>
          <Field name="cardExpiry" type="text" placeholder="12/26" />
        </div>
        <div>
          <label>CVV</label>
          <Field name="cardCvv" type="text" placeholder="123" />
        </div>
      </div>
    </div>

    <div v-if="values.paymentMethod === 'paypal'" class="payment-details">
      <div class="field-group">
        <label>Email de PayPal</label>
        <Field name="paypalEmail" type="email" placeholder="tu@email.com" />
        <ErrorMessage name="paypalEmail" class="error" />
      </div>
    </div>

    <div v-if="values.paymentMethod === 'bizum'" class="payment-details">
      <div class="field-group">
        <label>Teléfono móvil asociado a Bizum</label>
        <Field name="bizumPhone" type="tel" placeholder="600123456" />
        <ErrorMessage name="bizumPhone" class="error" />
      </div>
    </div>
    
    <div v-if="values.paymentMethod === 'transfer'" class="payment-details info-box">
      <p><strong>Datos bancarios de la empresa:</strong> ES99 1234 5678 9012 3456</p>
      <div class="field-group">
        <label>Referencia de transferencia *</label>
        <Field name="transferRef" type="text" placeholder="Ej: Pedido-123" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-methods { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
.payment-methods label { display: flex; align-items: center; gap: 5px; font-weight: bold; cursor: pointer; }
.payment-details { border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fafafa; }
.card-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
.row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field-group { display: flex; flex-direction: column; }
label { font-size: 0.9em; font-weight: bold; margin-bottom: 5px; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.error { color: red; font-size: 0.8em; margin-top: 4px; }
.block-error { display: block; margin-bottom: 15px; }
.valid-luhn { color: green; font-size: 0.8em; margin-top: 4px; }
.info-box { background: #e8f4fd; border-color: #b8daff; }
</style>