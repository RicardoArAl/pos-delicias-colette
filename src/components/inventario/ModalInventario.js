// src/components/inventario/ModalInventario.js
import React from 'react';
import styles from './ModalInventario.module.css';

const ModalInventario = ({
  ingredienteSeleccionado,
  cerrarModalInventario,
  nuevaCantidadStock,
  setNuevaCantidadStock,
  agregarCantidadRapida,
  confirmarActualizacionStock
}) => {
  return (
    <div className={styles.modalOverlay} onClick={cerrarModalInventario}>
      <div className={styles.modalInventario} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalInventarioHeader}>
          <h2>📦 Actualizar Stock</h2>
          <button className={styles.botonCerrar} onClick={cerrarModalInventario}>×</button>
        </div>

        <div className={styles.modalInventarioContenido}>
          <div className={styles.infoIngrediente}>
            <h3>{ingredienteSeleccionado.nombre}</h3>
            <p>Stock actual: <strong>{ingredienteSeleccionado.stock} {ingredienteSeleccionado.unidad}</strong></p>
            <p>Stock mínimo: <strong>{ingredienteSeleccionado.stockMinimo} {ingredienteSeleccionado.unidad}</strong></p>
          </div>

          <div className={styles.stockDisplay}>
            <input
              type="number"
              value={nuevaCantidadStock}
              onChange={(e) => setNuevaCantidadStock(e.target.value)}
              className={styles.inputStock}
              min="0"
            />
            <span className={styles.unidadLabel}>{ingredienteSeleccionado.unidad}</span>
          </div>

          <div className={styles.botonesRapidos}>
            <h4>Agregar rápido:</h4>
            <div className={styles.gridBotonesStock}>
              <button onClick={() => agregarCantidadRapida(5)}>+5</button>
              <button onClick={() => agregarCantidadRapida(10)}>+10</button>
              <button onClick={() => agregarCantidadRapida(20)}>+20</button>
              <button onClick={() => agregarCantidadRapida(50)}>+50</button>
              <button onClick={() => agregarCantidadRapida(100)}>+100</button>
              <button onClick={() => setNuevaCantidadStock('0')} className={styles.botonCero}>
                Vaciar
              </button>
            </div>
          </div>

          <div className={styles.accionesInventario}>
            <button className={styles.botonCancelar} onClick={cerrarModalInventario}>
              Cancelar
            </button>
            <button className={styles.botonGuardar} onClick={confirmarActualizacionStock}>
              ✓ Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInventario;