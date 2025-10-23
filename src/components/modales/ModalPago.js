// src/components/modales/ModalPago.js
import React from 'react';

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
    <div className="modal-overlay" onClick={cerrarPago}>
      <div className="modal-pago" onClick={(e) => e.stopPropagation()}>
        <h2>💰 Procesar Pago</h2>
        
        <div className="total-modal">
          <h3>Total a pagar: ${calcularTotal().toLocaleString()}</h3>
        </div>

        <div className="metodos-pago">
          <button
            className={metodoPago === 'efectivo' ? 'activo' : ''}
            onClick={() => setMetodoPago('efectivo')}
          >
            💵 Efectivo
          </button>
          <button
            className={metodoPago === 'transferencia' ? 'activo' : ''}
            onClick={() => setMetodoPago('transferencia')}
          >
            💳 Transferencia
          </button>
        </div>

        {metodoPago === 'efectivo' && (
          <>
            <div className="selector-billetes">
              <h4>Monto recibido:</h4>
              <div className="grid-billetes">
                <button onClick={() => agregarMonto(2000)}>$2.000</button>
                <button onClick={() => agregarMonto(5000)}>$5.000</button>
                <button onClick={() => agregarMonto(10000)}>$10.000</button>
                <button onClick={() => agregarMonto(20000)}>$20.000</button>
                <button onClick={() => agregarMonto(50000)}>$50.000</button>
                <button onClick={() => agregarMonto(100000)}>$100.000</button>
              </div>
            </div>

            <div className="monto-recibido">
              <h4>Monto ingresado:</h4>
              <input
                type="text"
                value={montoRecibido ? `$${parseInt(montoRecibido).toLocaleString()}` : '$0'}
                readOnly
              />
              <button 
                className="boton-limpiar"
                onClick={() => setMontoRecibido('')}
              >
                🗑️ Limpiar
              </button>
            </div>

            {montoRecibido && (
              <div className="cambio-display">
                <h4>Cambio:</h4>
                <p className={calcularCambio() < 0 ? 'cambio-negativo' : 'cambio-positivo'}>
                  ${calcularCambio().toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}

        <div className="acciones-modal">
          <button className="boton-cancelar" onClick={cerrarPago}>
            ❌ Cancelar
          </button>
          <button 
            className="boton-confirmar"
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