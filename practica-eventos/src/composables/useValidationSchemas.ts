import * as yup from 'yup';

// Simulador de validación asíncrona para el Código Postal
const validatePostalCode = async (cp: string | undefined): Promise<boolean> => {
  if (!cp) return false;
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulamos que solo estos CPs son válidos (según el PDF)
      const validCPs = ['28001', '08001', '41001', '46001'];
      resolve(validCPs.includes(cp));
    }, 500);
  });
};

export function useValidationSchemas() {
  // --- PASO 1: FACTURACIÓN ---
  const billingSchema = yup.object({
    fullName: yup.string()
      .required('El nombre es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo letras'),
    nif: yup.string()
      .required('El NIF/CIF es obligatorio')
      .matches(/^[0-9]{8}[A-Z]$|^[A-Z][0-9]{7}[A-Z]$/i, 'Formato inválido'),
    email: yup.string()
      .required('El email es obligatorio')
      .email('Formato de email inválido'),
    phone: yup.string()
      .required('El teléfono es obligatorio')
      .matches(/^[679][0-9]{8}$/, 'Debe ser un móvil español'),
    address: yup.string()
      .required('La dirección es obligatoria'),
    postalCode: yup.string()
      .required('El código postal es obligatorio')
      .matches(/^[0-9]{5}$/, 'Debe tener 5 dígitos')
      .test('valid-cp', 'El código postal no existe o no operamos ahí', validatePostalCode),
    city: yup.string().required('La ciudad es obligatoria'),
    province: yup.string().required('La provincia es obligatoria'),
    country: yup.string().required('El país es obligatorio')
  });

  // --- PASO 2: ENVÍO ---
  // Validación condicional: Solo exige los campos de envío si "useSameAddress" es falso
  const shippingSchema = yup.object({
    useSameAddress: yup.boolean(),
    'shipping.fullName': yup.string().when('useSameAddress', {
      is: false,
      then: (schema) => schema.required('El destinatario es obligatorio')
    }),
    'shipping.address': yup.string().when('useSameAddress', {
      is: false,
      then: (schema) => schema.required('La dirección de envío es obligatoria')
    }),
    'shipping.postalCode': yup.string().when('useSameAddress', {
      is: false,
      then: (schema) => schema.required('El CP es obligatorio').matches(/^[0-9]{5}$/, 'Debe tener 5 dígitos')
    }),
    'shipping.phone': yup.string().when('useSameAddress', {
      is: false,
      then: (schema) => schema.required('Teléfono de contacto obligatorio')
    }),
    'shipping.instructions': yup.string().max(200, 'Máximo 200 caracteres')
  });

  // --- PASO 3: PAGO ---
  // Los campos cambian según el método de pago seleccionado
  const paymentSchema = yup.object({
    paymentMethod: yup.string().required('Selecciona un método de pago'),
    
    // Si elige Tarjeta
    cardNumber: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) => schema.required('Número de tarjeta obligatorio')
    }),
    cardName: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) => schema.required('Nombre del titular obligatorio')
    }),
    
    // Si elige PayPal
    paypalEmail: yup.string().when('paymentMethod', {
      is: 'paypal',
      then: (schema) => schema.required('Email de PayPal obligatorio').email('Formato inválido')
    }),
    
    // Si elige Bizum
    bizumPhone: yup.string().when('paymentMethod', {
      is: 'bizum',
      then: (schema) => schema.required('Móvil para Bizum obligatorio').matches(/^[679][0-9]{8}$/, 'Móvil español inválido')
    })
  });

  // --- PASO 4: RESUMEN Y CONFIRMACIÓN ---
  const summarySchema = yup.object({
    termsAccepted: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones'),
    privacyAccepted: yup.boolean().oneOf([true], 'Debes aceptar la política de privacidad')
  });

  // Exportamos los CUATRO esquemas para poder usarlos en el Wizard
  return { billingSchema, shippingSchema, paymentSchema, summarySchema };
}