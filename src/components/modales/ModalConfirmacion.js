// src/components/modales/ModalConfirmacion.js
import React from 'react';
import styles from './ModalConfirmacion.module.css';

const ModalConfirmacion = () => {
  return (
    <div className={styles.modalConfirmacion}>
      <div className={styles.confirmacionContenido}>
        <div className={styles.iconoExito}>✅</div>
        <h2>¡Pago Exitoso!</h2>
        <p>La orden ha sido procesada correctamente</p>
      </div>
    </div>
  );
};

export default ModalConfirmacion;