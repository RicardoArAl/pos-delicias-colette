// src/components/historial/ModalDetalleVenta.js
import React from 'react';
import styles from './ModalDetalleVenta.module.css';

const ModalDetalleVenta = ({ ventaSeleccionada, cerrarDetalleVenta }) => {
  return (
    <div className={styles.modalOverlay} onClick={cerrarDetalleVenta}>
      <div className={styles.modalDetalle} onClick={(e) => e.stopPropagation()}>
        <h2>🧾 Detalle Venta #{ventaSeleccionada.numeroOrden}</h2>
        
        <div className={styles.infoVenta}>
          <p><strong>Fecha:</strong> {ventaSeleccionada.fecha}</p>
          <p><strong>Hora:</strong> {ventaSeleccionada.hora}</p>
          <p><strong>Método de pago:</strong> {ventaSeleccionada.metodoPago}</p>
          {ventaSeleccionada.metodoPago === 'efectivo' && (
            <>
              <p><strong>Monto recibido:</strong> ${ventaSeleccionada.montoRecibido?.toLocaleString()}</p>
              <p><strong>Cambio:</strong> ${ventaSeleccionada.cambio?.toLocaleString()}</p>
            </>
          )}
        </div>

        <div className={styles.productosVenta}>
          <h3>Productos:</h3>
          {ventaSeleccionada.productos.map((prod, index) => (
            <div key={index} className={styles.productoDetalle}>
              <span>{prod.nombre} x{prod.cantidad}</span>
              <span>${(prod.precio * prod.cantidad).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className={styles.totalVentaDetalle}>
          <h3>Total: ${ventaSeleccionada.total.toLocaleString()}</h3>
        </div>

        <button className={styles.botonCerrar} onClick={cerrarDetalleVenta}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalDetalleVenta;