// src/components/modales/ModalConfirmacion.js
import React from 'react';

const ModalConfirmacion = () => {
  return (
    <div className="modal-confirmacion">
      <div className="confirmacion-contenido">
        <div className="icono-exito">✅</div>
        <h2>¡Pago Exitoso!</h2>
        <p>La orden ha sido procesada correctamente</p>
      </div>
    </div>
  );
};

export default ModalConfirmacion;