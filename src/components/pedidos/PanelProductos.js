// src/components/pedidos/PanelProductos.js
import React from 'react';
import styles from './PanelProductos.module.css';

const PanelProductos = ({ 
  categorias, 
  categoriaActual, 
  setCategoriaActual, 
  productos, 
  agregarAlPedido,
  verificarDisponibilidad,
  inventario 
}) => {
  return (
    <div className={styles.panelProductos}>
      {/* Categorías */}
      <div className={styles.categorias}>
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={categoriaActual === cat.id ? styles.activo : ''}
            onClick={() => setCategoriaActual(cat.id)}
          >
            {cat.icono} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className={styles.gridProductos}>
        {productos[categoriaActual].map(producto => {
          const disponible = verificarDisponibilidad(producto.id, 1, inventario);

          return (
            <div
              key={producto.id}
              className={`${styles.tarjetaProducto} ${!disponible ? styles.productoAgotado : ''}`}
              onClick={() => disponible && agregarAlPedido(producto)}
              style={{ 
                cursor: disponible ? 'pointer' : 'not-allowed',
                opacity: disponible ? 1 : 0.7
              }}
            >
              <h3>{producto.nombre}</h3>
              <p className={styles.precio}>${producto.precio.toLocaleString()}</p>
              {!disponible && (
                <div className={styles.overlayAgotado}>
                  <span>❌ AGOTADO</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PanelProductos;