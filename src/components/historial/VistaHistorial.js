// src/components/historial/VistaHistorial.js
import React from 'react';
import { obtenerVentasFiltradas, exportarCSV } from '../../utils/helpers';
import styles from './VistaHistorial.module.css';

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
    <div className={styles.vistaHistorial}>
      <div className={styles.headerHistorial}>
        <h2>📊 Historial de Ventas</h2>
        {!autenticado && (
          <p className={styles.avisoLimitado}>⚠️ Mostrando solo últimas 24 horas. Ingresa PIN para ver todo.</p>
        )}
      </div>

      <div className={styles.filtrosHistorial}>
        <div className={styles.filtrosTiempo}>
          <button
            className={filtroHistorial === 'hoy' ? styles.activo : ''}
            onClick={() => setFiltroHistorial('hoy')}
          >
            Hoy
          </button>
          <button
            className={filtroHistorial === 'semana' ? styles.activo : ''}
            onClick={() => setFiltroHistorial('semana')}
          >
            Esta Semana
          </button>
          <button
            className={filtroHistorial === 'mes' ? styles.activo : ''}
            onClick={() => setFiltroHistorial('mes')}
          >
            Este Mes
          </button>
          <button
            className={filtroHistorial === 'todas' ? styles.activo : ''}
            onClick={() => setFiltroHistorial('todas')}
          >
            Todas
          </button>
        </div>

        <div className={styles.busquedaOrden}>
          <input
            type="text"
            placeholder="🔍 Buscar por número de orden..."
            value={busquedaOrden}
            onChange={(e) => setBusquedaOrden(e.target.value)}
          />
        </div>

        <button className={styles.botonExportar} onClick={handleExportar}>
          📥 Exportar CSV
        </button>
      </div>

      <div className={styles.listaVentas}>
        {ventasFiltradas.length === 0 ? (
          <div className={styles.sinVentas}>
            <p>No hay ventas para mostrar</p>
          </div>
        ) : (
          ventasFiltradas.map(venta => (
            <div 
              key={venta.id || `venta-${venta.numeroOrden}`} 
              className={styles.tarjetaVenta}
              onClick={() => abrirDetalleVenta(venta)}
            >
              <div className={styles.ventaHeader}>
                <h3>Orden #{venta.numeroOrden}</h3>
                <span className={styles.ventaMetodo}>{venta.metodoPago}</span>
              </div>
              <p>📅 {venta.fecha} - {venta.hora}</p>
              <p>🛒 {venta.productos.length} productos</p>
              <p className={styles.ventaTotal}>${venta.total.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaHistorial;