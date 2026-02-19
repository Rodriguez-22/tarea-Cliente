export const REGEX = {
  // Letras, espacios y tildes (3-50 caracteres)
  name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/,
  // NIF/NIE español válido
  nif: /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i,
  // Teléfono móvil español (empieza por 6, 7 o 9)
  phone: /^[679][0-9]{8}$/,
  // Email válido
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};