// src/components/modales/ModalPrecio.js
import React from 'react';
import styles from './ModalPrecio.module.css';

const ModalPrecio = ({
  productoTemporal,
  precioPersonalizado,
  setPrecioPersonalizado,
  agregarMontoPersonalizado,
  confirmarPrecioPersonalizado,
  cerrarModalPrecio
}) => {
  return (
    <div className={styles.modalOverlay} onClick={cerrarModalPrecio}>
      <div className={styles.modalPrecio} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalPrecioHeader}>
          <h2>💰 Precio Personalizado</h2>
          <button className={styles.botonCerrar} onClick={cerrarModalPrecio}>×</button>
        </div>

        <div className={styles.modalPrecioContenido}>
          <div className={styles.productoInfoPrecio}>
            <h3>{productoTemporal.nombre}</h3>
            <p className={styles.descripcionProducto}>{productoTemporal.descripcion}</p>
            <p className={styles.precioMinimo}>
              Precio desde: <strong>${productoTemporal.precioMinimo.toLocaleString()}</strong>
            </p>
          </div>

          <div className={styles.precioDisplay}>
            <span className={styles.simboloPeso}>$</span>
            <input
              type="text"
              value={precioPersonalizado ? parseInt(precioPersonalizado).toLocaleString() : '0'}
              readOnly
              className={styles.inputPrecioPersonalizado}
            />
          </div>

          <div className={styles.selectorBilletes}>
            <h3>Agregar monto:</h3>
            <div className={styles.gridBilletes}>
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

          <div className={styles.accionesPrecio}>
            <button 
              className={styles.botonLimpiarPrecio}
              onClick={() => setPrecioPersonalizado('')}
            >
              🔄 Limpiar
            </button>
            <button 
              className={styles.botonConfirmarPrecio}
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