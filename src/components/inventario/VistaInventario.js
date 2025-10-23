// src/components/inventario/VistaInventario.js
import React, { useState } from 'react';
import { obtenerEstadoStock } from '../../utils/helpers';
import { forzarActualizacionInventario } from '../../firebaseInventario';
import styles from './VistaInventario.module.css';

const VistaInventario = ({
  filtroCategoria,
  setFiltroCategoria,
  inventario,
  abrirModalInventario,
  cargarInventario
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
        await cargarInventario();
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
    <div className={styles.vistaInventario}>
      <div className={styles.inventarioHeader}>
        <div className={styles.inventarioHeaderTop}>
          <h2>📦 Gestión de Inventario</h2>
          <button 
            className={styles.btnSincronizar}
            onClick={sincronizarInventario}
            disabled={sincronizando}
            title="Sincronizar con productos del código"
          >
            {sincronizando ? '⏳ Sincronizando...' : '🔄 Sincronizar Inventario'}
          </button>
        </div>
        
        <div className={styles.filtrosInventario}>
          <button
            className={filtroCategoria === 'todos' ? styles.activo : ''}
            onClick={() => setFiltroCategoria('todos')}
          >
            Todos
          </button>
          <button
            className={filtroCategoria === 'bebidas' ? styles.activo : ''}
            onClick={() => setFiltroCategoria('bebidas')}
          >
            🥤 Bebidas
          </button>
          <button
            className={filtroCategoria === 'proteinas' ? styles.activo : ''}
            onClick={() => setFiltroCategoria('proteinas')}
          >
            🍖 Proteínas
          </button>
          <button
            className={filtroCategoria === 'embutidos' ? styles.activo : ''}
            onClick={() => setFiltroCategoria('embutidos')}
          >
            🌭 Embutidos
          </button>
          <button
            className={filtroCategoria === 'otros' ? styles.activo : ''}
            onClick={() => setFiltroCategoria('otros')}
          >
            🧺 Otros
          </button>
        </div>
      </div>

      <div className={styles.gridInventario}>
        {obtenerIngredientesFiltrados().map(item => {
          const estado = obtenerEstadoStock(item);
          return (
            <div
              key={item.id}
              className={`${styles.tarjetaInventario} ${styles[estado]}`}
              onClick={() => abrirModalInventario(item)}
            >
              <div className={styles.inventarioInfo}>
                <h3>{item.nombre}</h3>
                <p className={styles.categoria}>{
                  item.categoria === 'bebidas' ? '🥤 Bebidas':
                  item.categoria === 'proteinas' ? '🍖 Proteínas' :
                  item.categoria === 'embutidos' ? '🌭 Embutidos' :
                  '🧺 Otros'
                }</p>
              </div>
              <div className={styles.inventarioStock}>
                <span className={styles.stockActual}>{item.stock}</span>
                <span className={styles.stockUnidad}>{item.unidad}</span>
              </div>
              {estado === 'agotado' && (
                <div className={styles.badgeAgotado}>AGOTADO</div>
              )}
              {estado === 'bajo' && (
                <div className={styles.badgeBajo}>STOCK BAJO</div>
              )}
              <div className={styles.stockMinimo}>
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