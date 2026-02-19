<script setup lang="ts">
import { Field, ErrorMessage, useFormValues } from 'vee-validate';
import { computed } from 'vue';

const values = useFormValues();

// Simulamos unos productos del carrito [cite: 214]
const mockProducts = [
  { id: 1, name: 'Zapatillas Deportivas', price: 89.99, quantity: 1 },
  { id: 2, name: 'Camiseta Básica', price: 15.00, quantity: 2 }
];

// Cálculos del pedido [cite: 218-219]
const subtotal = computed(() => mockProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0));
const shippingCost = computed(() => values.value.country === 'España' ? 4.99 : 14.99);
const total = computed(() => subtotal.value + shippingCost.value);
</script>

<template>
  <div class="summary-container">
    <div class="summary-grid">
      <div class="summary-card">
        <h4>📄 Datos de Facturación</h4>
        <p><strong>Nombre:</strong> {{ values.fullName }}</p>
        <p><strong>NIF/CIF:</strong> {{ values.nif }}</p>
        <p><strong>Email:</strong> {{ values.email }}</p>
        <p><strong>Dirección:</strong> {{ values.address }}, {{ values.postalCode }}, {{ values.city }} ({{ values.country }})</p>
      </div>

      <div class="summary-card">
        <h4>📦 Dirección de Envío</h4>
        <div v-if="values.useSameAddress">
          <p><em>Misma que la de facturación</em></p>
        </div>
        <div v-else>
          <p><strong>Destinatario:</strong> {{ values.shipping?.fullName }}</p>
          <p><strong>Dirección:</strong> {{ values.shipping?.address }}, {{ values.shipping?.postalCode }}</p>
          <p v-if="values.shipping?.instructions"><strong>Notas:</strong> {{ values.shipping?.instructions }}</p>
        </div>
      </div>

      <div class="summary-card full-width">
        <h4>💳 Método de Pago</h4>
        <p v-if="values.paymentMethod === 'creditCard'">Tarjeta terminada en **** {{ values.cardNumber?.slice(-4) || 'XXXX' }}</p>
        <p v-if="values.paymentMethod === 'paypal'">PayPal ({{ values.paypalEmail }})</p>
        <p v-if="values.paymentMethod === 'transfer'">Transferencia Bancaria</p>
        <p v-if="values.paymentMethod === 'bizum'">Bizum ({{ values.bizumPhone }})</p>
      </div>
    </div>

    <div class="price-breakdown">
      <h4>Resumen del Pedido</h4>
      <ul>
        <li v-for="product in mockProducts" :key="product.id">
          {{ product.quantity }}x {{ product.name }} <span>{{ (product.price * product.quantity).toFixed(2) }}€</span>
        </li>
      </ul>
      <hr>
      <p>Subtotal: <span>{{ subtotal.toFixed(2) }}€</span></p>
      <p>Gastos de Envío: <span>{{ shippingCost.toFixed(2) }}€</span></p>
      <h3 class="total">Total Final: <span>{{ total.toFixed(2) }}€</span></h3>
    </div>

    <div class="legal-checks">
      <div class="field-group">
        <label>
          <Field name="termsAccepted" type="checkbox" :value="true" />
          He leído y acepto los términos y condiciones *
        </label>
        <ErrorMessage name="termsAccepted" class="error" />
      </div>

      <div class="field-group">
        <label>
          <Field name="privacyAccepted" type="checkbox" :value="true" />
          He leído la política de privacidad *
        </label>
        <ErrorMessage name="privacyAccepted" class="error" />
      </div>

      <div class="field-group">
        <label>
          <Field name="newsletter" type="checkbox" :value="true" />
          Deseo recibir ofertas y novedades (Opcional)
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
.summary-card { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 6px; }
.summary-card h4 { margin-top: 0; color: #495057; border-bottom: 2px solid #e9ecef; padding-bottom: 5px; }
.full-width { grid-column: span 2; }
.price-breakdown { background: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
.price-breakdown ul { list-style: none; padding: 0; margin: 0 0 10px 0; }
.price-breakdown li { display: flex; justify-content: space-between; margin-bottom: 5px; }
.price-breakdown p { display: flex; justify-content: space-between; margin: 5px 0; }
.total { display: flex; justify-content: space-between; font-size: 1.2em; border-top: 2px solid #bbdefb; padding-top: 10px; margin-top: 10px; }
.legal-checks { background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeeba; }
.field-group { display: flex; flex-direction: column; margin-bottom: 10px; }
label { font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.error { color: #dc3545; font-size: 0.85em; margin-top: 4px; }
</style>