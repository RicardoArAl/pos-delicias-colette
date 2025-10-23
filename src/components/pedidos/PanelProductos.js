// src/components/pedidos/PanelProductos.js
import React from 'react';

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
    <div className="panel-productos">
      {/* Categorías */}
      <div className="categorias">
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={categoriaActual === cat.id ? 'activo' : ''}
            onClick={() => setCategoriaActual(cat.id)}
          >
            {cat.icono} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="grid-productos">
        {productos[categoriaActual].map(producto => {
          const disponible = verificarDisponibilidad(producto.id, 1, inventario);

          return (
            <div
              key={producto.id}
              className={`tarjeta-producto ${!disponible ? 'producto-agotado' : ''}`}
              onClick={() => disponible && agregarAlPedido(producto)}
              style={{ 
                cursor: disponible ? 'pointer' : 'not-allowed',
                opacity: disponible ? 1 : 0.7
              }}
            >
              <h3>{producto.nombre}</h3>
              <p className="precio">${producto.precio.toLocaleString()}</p>
              {!disponible && (
                <div className="overlay-agotado">
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