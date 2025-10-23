// src/components/historial/VistaHistorial.js
import React from 'react';
import { obtenerVentasFiltradas, exportarCSV } from '../../utils/helpers';

const VistaHistorial = ({
  autenticado,
  filtroHistorial,
  setFiltroHistorial,
  busquedaOrden,
  setBusquedaOrden,
  ventas,
  abrirDetalleVenta
}) => {
  const ventasFiltradas = obtenerVentasFiltradas(ventas, filtroHistorial, busquedaOrden, autenticado);

  const handleExportar = () => {
    exportarCSV(ventasFiltradas);
  };

  return (
    <div className="vista-historial">
      <div className="header-historial">
        <h2>📊 Historial de Ventas</h2>
        {!autenticado && (
          <p className="aviso-limitado">⚠️ Mostrando solo últimas 24 horas. Ingresa PIN para ver todo.</p>
        )}
      </div>

      <div className="filtros-historial">
        <div className="filtros-tiempo">
          <button
            className={filtroHistorial === 'hoy' ? 'activo' : ''}
            onClick={() => setFiltroHistorial('hoy')}
          >
            Hoy
          </button>
          <button
            className={filtroHistorial === 'semana' ? 'activo' : ''}
            onClick={() => setFiltroHistorial('semana')}
          >
            Esta Semana
          </button>
          <button
            className={filtroHistorial === 'mes' ? 'activo' : ''}
            onClick={() => setFiltroHistorial('mes')}
          >
            Este Mes
          </button>
          <button
            className={filtroHistorial === 'todas' ? 'activo' : ''}
            onClick={() => setFiltroHistorial('todas')}
          >
            Todas
          </button>
        </div>

        <div className="busqueda-orden">
          <input
            type="text"
            placeholder="🔍 Buscar por número de orden..."
            value={busquedaOrden}
            onChange={(e) => setBusquedaOrden(e.target.value)}
          />
        </div>

        <button className="boton-exportar" onClick={handleExportar}>
          📥 Exportar CSV
        </button>
      </div>

      <div className="lista-ventas">
        {ventasFiltradas.length === 0 ? (
          <div className="sin-ventas">
            <p>No hay ventas para mostrar</p>
          </div>
        ) : (
          ventasFiltradas.map(venta => (
            <div 
              key={venta.id || `venta-${venta.numeroOrden}`} 
              className="tarjeta-venta"
              onClick={() => abrirDetalleVenta(venta)}
            >
              <div className="venta-header">
                <h3>Orden #{venta.numeroOrden}</h3>
                <span className="venta-metodo">{venta.metodoPago}</span>
              </div>
              <p>📅 {venta.fecha} - {venta.hora}</p>
              <p>🛒 {venta.productos.length} productos</p>
              <p className="venta-total">${venta.total.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaHistorial;