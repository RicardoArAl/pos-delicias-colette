// src/components/modales/ModalPIN.js
import React from 'react';
import styles from './ModalPIN.module.css';

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
    <div className={styles.modalPinOverlay} onClick={cerrarModalPIN}>
      <div className={styles.modalPinContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalPinHeader}>
          <h2>🔐 Acceso Restringido</h2>
          <p>Ingresa el PIN de 4 dígitos</p>
        </div>

        <div className={styles.pinDisplay}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.pinCircle} ${pinIngresado.length > i ? styles.filled : ''}`}
            />
          ))}
        </div>

        <div className={styles.pinTeclado}>
          {numeros.map((num) => (
            <button
              key={num}
              className={styles.pinBoton}
              onClick={() => agregarDigitoPIN(num.toString())}
            >
              {num}
            </button>
          ))}
          
          <button
            className={`${styles.pinBoton} ${styles.borrar}`}
            onClick={borrarDigitoPIN}
            disabled={pinIngresado.length === 0}
          >
            ⌫
          </button>
          
          <button
            className={styles.pinBoton}
            onClick={() => agregarDigitoPIN('0')}
          >
            0
          </button>
          
          <button
            className={`${styles.pinBoton} ${styles.especial}`}
            onClick={confirmarPIN}
            disabled={pinIngresado.length !== 4}
          >
            ✓
          </button>
        </div>

        {errorPIN && (
          <div className={styles.pinError}>{errorPIN}</div>
        )}

        <button className={styles.pinBotonCancelar} onClick={cerrarModalPIN}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalPIN;