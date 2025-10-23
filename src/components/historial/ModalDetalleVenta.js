// src/components/historial/ModalDetalleVenta.js
import React from 'react';

const ModalDetalleVenta = ({ ventaSeleccionada, cerrarDetalleVenta }) => {
  return (
    <div className="modal-overlay" onClick={cerrarDetalleVenta}>
      <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
        <h2>🧾 Detalle Venta #{ventaSeleccionada.numeroOrden}</h2>
        
        <div className="info-venta">
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

        <div className="productos-venta">
          <h3>Productos:</h3>
          {ventaSeleccionada.productos.map((prod, index) => (
            <div key={index} className="producto-detalle">
              <span>{prod.nombre} x{prod.cantidad}</span>
              <span>${(prod.precio * prod.cantidad).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="total-venta-detalle">
          <h3>Total: ${ventaSeleccionada.total.toLocaleString()}</h3>
        </div>

        <button className="boton-cerrar" onClick={cerrarDetalleVenta}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalDetalleVenta;