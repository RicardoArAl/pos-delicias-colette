// src/components/Header.js
import React from 'react';

const Header = ({ 
  vistaActual, 
  setVistaActual, 
  ordenesPendientes, 
  manejarClickVistaProtegida,
  autenticado,
  cerrarSesion 
}) => {
  return (
    <header className="header">
      <h1>🍔 Delicias de Colette - POS</h1>
      <div className="header-buttons">
        <button
          className={vistaActual === 'pedidos' ? 'activo' : ''}
          onClick={() => setVistaActual('pedidos')}
        >
          🛒 Pedidos
        </button>
        
        <button
          className={vistaActual === 'pendientes' ? 'activo' : ''}
          onClick={() => setVistaActual('pendientes')}
        >
          ⏳ Pendientes ({ordenesPendientes.length})
        </button>
        
        <button
          className={`${vistaActual === 'historial' ? 'activo' : ''} ${!autenticado ? 'boton-con-candado' : ''}`}
          onClick={() => manejarClickVistaProtegida('historial')}
          style={{ background: '#3b82f6' }}
        >
          Historial
        </button>
        
        <button
          className={`${vistaActual === 'reportes' ? 'activo' : ''} ${!autenticado ? 'boton-con-candado' : ''}`}
          onClick={() => manejarClickVistaProtegida('reportes')}
          style={{ background: '#8b5cf6' }}
        >
          Reportes
        </button>

        <button
          className={`boton-nav ${vistaActual === 'inventario' ? 'activo' : ''}`}
          onClick={() => manejarClickVistaProtegida('inventario')}
        >
          📦 Inventario
        </button>

        {autenticado && (
          <button
            className="boton-cerrar-sesion"
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