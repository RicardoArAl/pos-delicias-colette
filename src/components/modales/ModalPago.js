// src/components/modales/ModalPago.js
import React from 'react';
import styles from './ModalPago.module.css';

const ModalPago = ({
  calcularTotal,
  metodoPago,
  setMetodoPago,
  agregarMonto,
  montoRecibido,
  setMontoRecibido,
  calcularCambio,
  cerrarPago,
  confirmarPago
}) => {
  return (
    <div className={styles.modalOverlay} onClick={cerrarPago}>
      <div className={styles.modalPago} onClick={(e) => e.stopPropagation()}>
        <h2>💰 Procesar Pago</h2>
        
        <div className={styles.totalModal}>
          <h3>Total a pagar: ${calcularTotal().toLocaleString()}</h3>
        </div>

        <div className={styles.metodosPago}>
          <button
            className={metodoPago === 'efectivo' ? styles.activo : ''}
            onClick={() => setMetodoPago('efectivo')}
          >
            💵 Efectivo
          </button>
          <button
            className={metodoPago === 'transferencia' ? styles.activo : ''}
            onClick={() => setMetodoPago('transferencia')}
          >
            💳 Transferencia
          </button>
        </div>

        {metodoPago === 'efectivo' && (
          <>
            <div className={styles.selectorBilletes}>
              <h4>Monto recibido:</h4>
              <div className={styles.gridBilletes}>
                <button onClick={() => agregarMonto(2000)}>$2.000</button>
                <button onClick={() => agregarMonto(5000)}>$5.000</button>
                <button onClick={() => agregarMonto(10000)}>$10.000</button>
                <button onClick={() => agregarMonto(20000)}>$20.000</button>
                <button onClick={() => agregarMonto(50000)}>$50.000</button>
                <button onClick={() => agregarMonto(100000)}>$100.000</button>
              </div>
            </div>

            <div className={styles.montoRecibido}>
              <h4>Monto ingresado:</h4>
              <input
                type="text"
                value={montoRecibido ? `$${parseInt(montoRecibido).toLocaleString()}` : '$0'}
                readOnly
              />
              <button 
                className={styles.botonLimpiar}
                onClick={() => setMontoRecibido('')}
              >
                🗑️ Limpiar
              </button>
            </div>

            {montoRecibido && (
              <div className={styles.cambioDisplay}>
                <h4>Cambio:</h4>
                <p className={calcularCambio() < 0 ? styles.cambioNegativo : styles.cambioPositivo}>
                  ${calcularCambio().toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}

        <div className={styles.accionesModal}>
          <button className={styles.botonCancelar} onClick={cerrarPago}>
            ❌ Cancelar
          </button>
          <button 
            className={styles.botonConfirmar}
            onClick={confirmarPago}
            disabled={!metodoPago || (metodoPago === 'efectivo' && calcularCambio() < 0)}
          >
            ✅ Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPago;