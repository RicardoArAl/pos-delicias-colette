// src/pinConfig.js
// PIN ofuscado para evitar inspección directa

const _0x1a2b = ['1','0','2','8']; // Cambia estos números por tu PIN
const _getPIN = () => _0x1a2b.join('');

// Función de verificación
export const verificarPINSeguro = (input) => {
  return input === _getPIN();
};

// Tiempo de sesión en milisegundos (30 minutos)
export const TIEMPO_SESION_MS = 30 * 60 * 1000;