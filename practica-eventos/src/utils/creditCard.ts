// src/utils/creditCard.ts

/**
 * Detecta el tipo de tarjeta de crédito basándose en sus primeros dígitos.
 */
export const getCardType = (cardNumber: string): string => {
  // Quitamos cualquier espacio o guión que haya introducido el usuario
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'Amex';
  
  return 'Desconocida';
};

/**
 * Algoritmo de Luhn para verificar matemáticamente si un número de tarjeta es válido.
 */
export const luhnCheck = (cardNumber: string): boolean => {
  // 1. Limpiamos el número de espacios/letras y lo convertimos en un array de números invertido
  const arr = (cardNumber + '')
    .replace(/\D/g, '')
    .split('')
    .reverse()
    .map(x => parseInt(x, 10));
    
  if (arr.length === 0) return false;

  // 2. Aplicamos la fórmula matemática de Luhn
  const sum = arr.reduce((acc, val, i) => {
    let num = val;
    // Multiplicamos por 2 los números en posiciones impares (recordemos que empezamos en índice 0)
    if (i % 2 !== 0) {
      num *= 2;
      // Si el resultado tiene dos dígitos (es mayor que 9), le restamos 9
      if (num > 9) num -= 9;
    }
    return acc + num;
  }, 0);

  // 3. Es válida si el total es múltiplo de 10
  return sum % 10 === 0;
};