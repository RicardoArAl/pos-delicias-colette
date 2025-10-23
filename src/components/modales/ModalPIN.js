// src/components/modales/ModalPIN.js
import React from 'react';

const ModalPIN = ({
  pinIngresado,
  errorPIN,
  agregarDigitoPIN,
  borrarDigitoPIN,
  confirmarPIN,
  cerrarModalPIN
}) => {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  return (
    <div className="modal-pin-overlay" onClick={cerrarModalPIN}>
      <div className="modal-pin-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-pin-header">
          <h2>🔐 Acceso Restringido</h2>
          <p>Ingresa el PIN de 4 dígitos</p>
        </div>

        <div className="pin-display">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-circle ${pinIngresado.length > i ? 'filled' : ''}`}
            />
          ))}
        </div>

        <div className="pin-teclado">
          {numeros.map((num) => (
            <button
              key={num}
              className="pin-boton"
              onClick={() => agregarDigitoPIN(num.toString())}
            >
              {num}
            </button>
          ))}
          
          <button
            className="pin-boton borrar"
            onClick={borrarDigitoPIN}
            disabled={pinIngresado.length === 0}
          >
            ⌫
          </button>
          
          <button
            className="pin-boton"
            onClick={() => agregarDigitoPIN('0')}
          >
            0
          </button>
          
          <button
            className="pin-boton especial"
            onClick={confirmarPIN}
            disabled={pinIngresado.length !== 4}
          >
            ✓
          </button>
        </div>

        {errorPIN && (
          <div className="pin-error">{errorPIN}</div>
        )}

        <button className="pin-boton-cancelar" onClick={cerrarModalPIN}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalPIN;