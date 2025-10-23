// src/components/modales/ModalPrecio.js
import React from 'react';

const ModalPrecio = ({
  productoTemporal,
  precioPersonalizado,
  setPrecioPersonalizado,
  agregarMontoPersonalizado,
  confirmarPrecioPersonalizado,
  cerrarModalPrecio
}) => {
  return (
    <div className="modal-overlay" onClick={cerrarModalPrecio}>
      <div className="modal-precio" onClick={(e) => e.stopPropagation()}>
        <div className="modal-precio-header">
          <h2>💰 Precio Personalizado</h2>
          <button className="boton-cerrar" onClick={cerrarModalPrecio}>×</button>
        </div>

        <div className="modal-precio-contenido">
          <div className="producto-info-precio">
            <h3>{productoTemporal.nombre}</h3>
            <p className="descripcion-producto">{productoTemporal.descripcion}</p>
            <p className="precio-minimo">
              Precio desde: <strong>${productoTemporal.precioMinimo.toLocaleString()}</strong>
            </p>
          </div>

          <div className="precio-display">
            <span className="simbolo-peso">$</span>
            <input
              type="text"
              value={precioPersonalizado ? parseInt(precioPersonalizado).toLocaleString() : '0'}
              readOnly
              className="input-precio-personalizado"
            />
          </div>

          <div className="selector-billetes">
            <h3>Agregar monto:</h3>
            <div className="grid-billetes">
              <button onClick={() => agregarMontoPersonalizado(1000)}>
                + $1.000
              </button>
              <button onClick={() => agregarMontoPersonalizado(5000)}>
                + $5.000
              </button>
              <button onClick={() => agregarMontoPersonalizado(10000)}>
                + $10.000
              </button>
              <button onClick={() => agregarMontoPersonalizado(25000)}>
                + $25.000
              </button>
              <button onClick={() => agregarMontoPersonalizado(30000)}>
                + $30.000
              </button>
              <button onClick={() => agregarMontoPersonalizado(50000)}>
                + $50.000
              </button>
            </div>
          </div>

          <div className="acciones-precio">
            <button 
              className="boton-limpiar-precio"
              onClick={() => setPrecioPersonalizado('')}
            >
              🔄 Limpiar
            </button>
            <button 
              className="boton-confirmar-precio"
              onClick={confirmarPrecioPersonalizado}
              disabled={!precioPersonalizado || parseInt(precioPersonalizado) < productoTemporal.precioMinimo}
            >
              ✓ Agregar al Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPrecio;