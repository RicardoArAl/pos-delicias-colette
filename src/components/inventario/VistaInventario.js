// src/components/inventario/VistaInventario.js
import React, { useState } from 'react';
import { obtenerEstadoStock } from '../../utils/helpers';
import { forzarActualizacionInventario } from '../../firebaseInventario';

const VistaInventario = ({
  filtroCategoria,
  setFiltroCategoria,
  inventario,
  abrirModalInventario,
  cargarInventario // Necesitamos esta función de App.js para recargar después de sincronizar
}) => {
  const [sincronizando, setSincronizando] = useState(false);

  const obtenerIngredientesFiltrados = () => {
    const items = Object.values(inventario);
  
    if (filtroCategoria === 'todos') {
      return items;
    }
  
    return items.filter(item => item.categoria === filtroCategoria);
  };

  const sincronizarInventario = async () => {
    if (!window.confirm('¿Deseas sincronizar el inventario con los productos del código?\n\nEsto agregará nuevos productos pero mantendrá los stocks actuales.')) {
      return;
    }

    setSincronizando(true);
    
    try {
      const exito = await forzarActualizacionInventario();
      
      if (exito) {
        await cargarInventario(); // Recargar inventario desde Firebase
        alert('✅ Inventario sincronizado exitosamente');
      } else {
        alert('❌ Error al sincronizar inventario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al sincronizar inventario');
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <div className="vista-inventario">
      <div className="inventario-header">
        <div className="inventario-header-top">
          <h2>📦 Gestión de Inventario</h2>
          <button 
            className="btn-sincronizar"
            onClick={sincronizarInventario}
            disabled={sincronizando}
            title="Sincronizar con productos del código"
          >
            {sincronizando ? '⏳ Sincronizando...' : '🔄 Sincronizar Inventario'}
          </button>
        </div>
        
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