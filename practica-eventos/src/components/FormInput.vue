<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  id: string;
  label: string;
  type?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur'): void;
  (e: 'input'): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input');
};
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>
    <input 
      :id="id" 
      :type="type || 'text'" 
      :value="modelValue"
      @input="handleInput"
      @blur="$emit('blur')"
      :class="{ 'is-invalid': error, 'is-valid': modelValue && !error }"
    />
    <span v-if="error" class="error-msg">❌ {{ error }}</span>
    <span v-else-if="modelValue && !error" class="success-msg">✅ Correcto</span>
  </div>
</template>

<style scoped>
.input-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
.is-invalid { border: 2px solid red; }
.is-valid { border: 2px solid green; }
.error-msg { color: red; font-size: 0.8rem; margin-top: 4px; }
.success-msg { color: green; font-size: 0.8rem; margin-top: 4px; }
</style>