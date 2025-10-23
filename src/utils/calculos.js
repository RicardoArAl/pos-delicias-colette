// src/utils/calculos.js

export const calcularTotal = (pedido) => {
  return pedido.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

export const calcularCambio = (montoRecibido, total) => {
  const recibido = parseInt(montoRecibido) || 0;
  return recibido - total;
};

export const calcularEstadisticas = (ventas) => {
  const totalVendido = ventas.reduce((sum, v) => sum + v.total, 0);
  const numeroOrdenes = ventas.length;
  const promedioVenta = numeroOrdenes > 0 ? totalVendido / numeroOrdenes : 0;
  
  const porEfectivo = ventas
    .filter(v => v.metodoPago === 'efectivo')
    .reduce((sum, v) => sum + v.total, 0);
  
  const porTransferencia = ventas
    .filter(v => v.metodoPago === 'transferencia')
    .reduce((sum, v) => sum + v.total, 0);

  return {
    totalVendido,
    numeroOrdenes,
    promedioVenta,
    porEfectivo,
    porTransferencia
  };
};