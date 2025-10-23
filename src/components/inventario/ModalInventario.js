// src/components/inventario/ModalInventario.js
import React from 'react';

const ModalInventario = ({
  ingredienteSeleccionado,
  cerrarModalInventario,
  nuevaCantidadStock,
  setNuevaCantidadStock,
  agregarCantidadRapida,
  confirmarActualizacionStock
}) => {
  return (
    <div className="modal-overlay" onClick={cerrarModalInventario}>
      <div className="modal-inventario" onClick={(e) => e.stopPropagation()}>
        <div className="modal-inventario-header">
          <h2>📦 Actualizar Stock</h2>
          <button className="boton-cerrar" onClick={cerrarModalInventario}>×</button>
        </div>

        <div className="modal-inventario-contenido">
          <div className="info-ingrediente">
            <h3>{ingredienteSeleccionado.nombre}</h3>
            <p>Stock actual: <strong>{ingredienteSeleccionado.stock} {ingredienteSeleccionado.unidad}</strong></p>
            <p>Stock mínimo: <strong>{ingredienteSeleccionado.stockMinimo} {ingredienteSeleccionado.unidad}</strong></p>
          </div>

          <div className="stock-display">
            <input
              type="number"
              value={nuevaCantidadStock}
              onChange={(e) => setNuevaCantidadStock(e.target.value)}
              className="input-stock"
              min="0"
            />
            <span className="unidad-label">{ingredienteSeleccionado.unidad}</span>
          </div>

          <div className="botones-rapidos">
            <h4>Agregar rápido:</h4>
            <div className="grid-botones-stock">
              <button onClick={() => agregarCantidadRapida(5)}>+5</button>
              <button onClick={() => agregarCantidadRapida(10)}>+10</button>
              <button onClick={() => agregarCantidadRapida(20)}>+20</button>
              <button onClick={() => agregarCantidadRapida(50)}>+50</button>
              <button onClick={() => agregarCantidadRapida(100)}>+100</button>
              <button onClick={() => setNuevaCantidadStock('0')} className="boton-cero">
                Vaciar
              </button>
            </div>
          </div>

          <div className="acciones-inventario">
            <button className="boton-cancelar" onClick={cerrarModalInventario}>
              Cancelar
            </button>
            <button className="boton-guardar" onClick={confirmarActualizacionStock}>
              ✓ Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInventario;