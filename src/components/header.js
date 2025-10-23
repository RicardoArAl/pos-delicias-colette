// src/components/Header.js
import React from 'react';
import styles from './Header.module.css';

const Header = ({ 
  vistaActual, 
  setVistaActual, 
  ordenesPendientes, 
  manejarClickVistaProtegida,
  autenticado,
  cerrarSesion 
}) => {
  return (
    <header className={styles.header}>
      <h1>🍔 Delicias de Colette - POS</h1>
      <div className={styles.headerButtons}>
        <button
          className={vistaActual === 'pedidos' ? styles.activo : ''}
          onClick={() => setVistaActual('pedidos')}
        >
          🛒 Pedidos
        </button>
        
        <button
          className={vistaActual === 'pendientes' ? styles.activo : ''}
          onClick={() => setVistaActual('pendientes')}
        >
          ⏳ Pendientes ({ordenesPendientes.length})
        </button>
        
        <button
          className={`${vistaActual === 'historial' ? styles.activo : ''} ${!autenticado ? styles.botonConCandado : ''}`}
          onClick={() => manejarClickVistaProtegida('historial')}
          style={{ background: '#3b82f6' }}
        >
          Historial
        </button>
        
        <button
          className={`${vistaActual === 'reportes' ? styles.activo : ''} ${!autenticado ? styles.botonConCandado : ''}`}
          onClick={() => manejarClickVistaProtegida('reportes')}
          style={{ background: '#8b5cf6' }}
        >
          Reportes
        </button>

        <button
          className={`${styles.botonNav} ${vistaActual === 'inventario' ? styles.activo : ''}`}
          onClick={() => manejarClickVistaProtegida('inventario')}
        >
          📦 Inventario
        </button>

        {autenticado && (
          <button
            className={styles.botonCerrarSesion}
            onClick={cerrarSesion}
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;