// src/components/inventario/VistaInventario.js
import React from 'react';
import { obtenerEstadoStock } from '../../utils/helpers';

const VistaInventario = ({
  filtroCategoria,
  setFiltroCategoria,
  inventario,
  abrirModalInventario
}) => {
  const obtenerIngredientesFiltrados = () => {
    const items = Object.values(inventario);
  
    if (filtroCategoria === 'todos') {
      return items;
    }
  
    return items.filter(item => item.categoria === filtroCategoria);
  };

  return (
    <div className="vista-inventario">
      <div className="inventario-header">
        <h2>📦 Gestión de Inventario</h2>
        <div className="filtros-inventario">
          <button
            className={filtroCategoria === 'todos' ? 'activo' : ''}
            onClick={() => setFiltroCategoria('todos')}
          >
            Todos
          </button>
          <button
            className={filtroCategoria === 'bebidas' ? 'activo' : ''}
            onClick={() => setFiltroCategoria('bebidas')}
          >
            🥤 Bebidas
          </button>
          <button
            className={filtroCategoria === 'proteinas' ? 'activo' : ''}
            onClick={() => setFiltroCategoria('proteinas')}
          >
            🍖 Proteínas
          </button>
          <button
            className={filtroCategoria === 'embutidos' ? 'activo' : ''}
            onClick={() => setFiltroCategoria('embutidos')}
          >
            🌭 Embutidos
          </button>
          <button
            className={filtroCategoria === 'otros' ? 'activo' : ''}
            onClick={() => setFiltroCategoria('otros')}
          >
            🧺 Otros
          </button>
        </div>
      </div>

      <div className="grid-inventario">
        {obtenerIngredientesFiltrados().map(item => {
          const estado = obtenerEstadoStock(item);
          return (
            <div
              key={item.id}
              className={`tarjeta-inventario ${estado}`}
              onClick={() => abrirModalInventario(item)}
            >
              <div className="inventario-info">
                <h3>{item.nombre}</h3>
                <p className="categoria">{
                  item.categoria === 'bebidas' ? '🥤 Bebidas':
                  item.categoria === 'proteinas' ? '🍖 Proteínas' :
                  item.categoria === 'embutidos' ? '🌭 Embutidos' :
                  '🧺 Otros'
                }</p>
              </div>
              <div className="inventario-stock">
                <span className="stock-actual">{item.stock}</span>
                <span className="stock-unidad">{item.unidad}</span>
              </div>
              {estado === 'agotado' && (
                <div className="badge-agotado">AGOTADO</div>
              )}
              {estado === 'bajo' && (
                <div className="badge-bajo">STOCK BAJO</div>
              )}
              <div className="stock-minimo">
                Mínimo: {item.stockMinimo} {item.unidad}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VistaInventario;