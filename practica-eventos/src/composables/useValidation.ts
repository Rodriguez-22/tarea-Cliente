import { ref } from 'vue';
import { REGEX } from '../utils/regex';

export function useValidation() {
  const errors = ref<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    errors.value[field] = ''; // Reset error

    if (!value) {
      errors.value[field] = 'Este campo es obligatorio';
      return false;
    }

    switch (field) {
      case 'name':
        if (!REGEX.name.test(value)) errors.value[field] = 'Solo letras, de 3 a 50 caracteres.';
        break;
      case 'nif':
        if (!REGEX.nif.test(value)) errors.value[field] = 'Formato de NIF/NIE inválido.';
        break;
      case 'phone':
        if (!REGEX.phone.test(value)) errors.value[field] = 'Debe ser un móvil español válido (9 dígitos).';
        break;
      case 'email':
        if (!REGEX.email.test(value)) errors.value[field] = 'Formato de email incorrecto.';
        break;
    }

    return errors.value[field] === '';
  };

  return { errors, validateField };
}