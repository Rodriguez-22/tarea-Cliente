<script setup lang="ts">
import { ref, computed } from 'vue';
import { Form } from 'vee-validate';
import { useValidationSchemas } from '../../composables/useValidationSchemas';
import type { CheckoutState } from '../../types/checkout';

// Importamos los componentes de cada paso
import Step1Billing from './Step1Billing.vue';
import Step2Shipping from './Step2Shipping.vue';
import Step3Payment from './Step3Payment.vue';
import Step4Summary from './Step4Summary.vue';

const currentStep = ref(1);
const totalSteps = 4;

// Extraemos los CUATRO esquemas de validación
const { billingSchema, shippingSchema, paymentSchema, summarySchema } = useValidationSchemas();

// Propiedad computada para inyectar el esquema correcto según el paso actual
const currentSchema = computed(() => {
  if (currentStep.value === 1) return billingSchema;
  if (currentStep.value === 2) return shippingSchema;
  if (currentStep.value === 3) return paymentSchema;
  if (currentStep.value === 4) return summarySchema;
  return undefined;
});

// Estado global del checkout
const checkoutData = ref<CheckoutState>({
  billing: { fullName: '', nif: '', email: '', phone: '', address: '', postalCode: '', city: '', province: '', country: 'España' },
  shipping: { fullName: '', nif: '', email: '', phone: '', address: '', postalCode: '', city: '', province: '', country: 'España' },
  useSameAddress: true,
  paymentMethod: '',
  discountCode: '',
  termsAccepted: false,
  privacyAccepted: false
});

// Función que se ejecuta cuando el paso actual pasa la validación sin errores
const onStepSubmit = (values: any) => {
  // Fusionamos los datos validados del formulario con nuestro estado global
  if (currentStep.value === 1) Object.assign(checkoutData.value.billing, values);
  if (currentStep.value === 2) {
    checkoutData.value.useSameAddress = values.useSameAddress;
    if (values.shipping) Object.assign(checkoutData.value.shipping, values.shipping);
  }
  if (currentStep.value === 3) {
    checkoutData.value.paymentMethod = values.paymentMethod;
  }
  if (currentStep.value === 4) {
    checkoutData.value.termsAccepted = values.termsAccepted;
    checkoutData.value.privacyAccepted = values.privacyAccepted;
  }
  
  // Avanzamos al siguiente paso o finalizamos
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  } else {
    alert('¡Pedido completado con éxito!');
    console.log('Datos finales del pedido:', checkoutData.value);
  }
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
</script>

<template>
  <div class="wizard-container">
    <h2>Checkout Seguro</h2>
    
    <div class="progress-bar">
      <span>Paso {{ currentStep }} de {{ totalSteps }}</span>
      <progress :value="currentStep" :max="totalSteps"></progress>
    </div>

    <Form 
      @submit="onStepSubmit" 
      :validation-schema="currentSchema"
      :initial-values="checkoutData"
      keep-values
    >
      
      <div v-if="currentStep === 1" class="step-content">
        <h3>1. Datos de Facturación</h3>
        <Step1Billing />
      </div>

      <div v-if="currentStep === 2" class="step-content">
        <h3>2. Dirección de Envío</h3>
        <Step2Shipping />
      </div>

      <div v-if="currentStep === 3" class="step-content">
        <h3>3. Método de Pago</h3>
        <Step3Payment />
      </div>

      <div v-if="currentStep === 4" class="step-content">
        <h3>4. Resumen y Confirmación</h3>
        <Step4Summary />
      </div>

      <div class="navigation-buttons">
        <button type="button" class="btn-prev" @click="prevStep" :disabled="currentStep === 1">Anterior</button>
        <button type="submit" class="btn-next">
          {{ currentStep === totalSteps ? 'Confirmar Pedido' : 'Siguiente' }}
        </button>
      </div>
      
    </Form>
  </div>
</template>

<style scoped>
.wizard-container { 
  max-width: 750px; 
  margin: 0 auto; 
  padding: 40px; 
  background: var(--bg-card); 
  border-radius: var(--radius); 
  box-shadow: var(--shadow); 
}
h2 { text-align: center; color: var(--text-main); margin-bottom: 10px; font-size: 2rem; }
.progress-bar { margin-bottom: 30px; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.progress-bar span { font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; }
.progress-bar progress { 
  width: 100%; height: 8px; border-radius: 10px; overflow: hidden; 
  appearance: none; -webkit-appearance: none; 
}
.progress-bar progress::-webkit-progress-bar { background-color: #e5e7eb; }
.progress-bar progress::-webkit-progress-value { background-color: var(--primary); transition: width 0.4s ease; }

.step-content { 
  border: 1px solid var(--border); 
  padding: 30px; 
  border-radius: 12px; 
  margin-bottom: 30px; 
  background-color: #fff;
  animation: fadeIn 0.4s ease; /* Animación suave al cambiar de paso */
}
.step-content h3 { margin-top: 0; color: var(--primary); border-bottom: 2px solid #e0e7ff; padding-bottom: 10px; margin-bottom: 25px; }

.navigation-buttons { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border); margin-top: 20px; }
button { 
  padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer; 
  font-weight: 600; font-size: 1rem; transition: all 0.2s; 
}
.btn-next { background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3); }
.btn-next:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
.btn-prev { background: white; color: var(--text-main); border: 1px solid var(--border); }
.btn-prev:hover:not(:disabled) { background: #f9fafb; border-color: #9ca3af; }
.btn-prev:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; border-color: #e5e7eb; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>