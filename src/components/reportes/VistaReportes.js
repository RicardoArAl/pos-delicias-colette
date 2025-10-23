// src/components/reportes/VistaReportes.js
import React from 'react';
import { obtenerVentasFiltradas, exportarCSV } from '../../utils/helpers';
import { calcularEstadisticas as calcularStats } from '../../utils/calculos';
import styles from './VistaReportes.module.css';

const VistaReportes = ({
  filtroHistorial,
  setFiltroHistorial,
  ventas,
  autenticado
}) => {
  const ventasFiltradas = obtenerVentasFiltradas(ventas, filtroHistorial, '', autenticado);
  const estadisticas = calcularStats(ventasFiltradas);

  const handleExportar = () => {
    exportarCSV(ventasFiltradas);
  };

  return (
    <div className={styles.vistaReportes}>
      <h2>📈 Reportes y Estadísticas</h2>

      {/* FILTROS DE TIEMPO */}
      <div className={styles.filtrosReportes}>
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

      {/* GRID DE ESTADÍSTICAS */}
      <div className={styles.gridEstadisticas}>
        <div className={styles.tarjetaEstadistica}>
          <h3>💰 Total Vendido</h3>
          <p className={styles.valorGrande}>
            ${estadisticas.totalVendido.toLocaleString()}
          </p>
        </div>

        <div className={styles.tarjetaEstadistica}>
          <h3>🛒 Número de Órdenes</h3>
          <p className={styles.valorGrande}>{estadisticas.numeroOrdenes}</p>
        </div>

        <div className={styles.tarjetaEstadistica}>
          <h3>📊 Promedio por Venta</h3>
          <p className={styles.valorGrande}>
            ${Math.round(estadisticas.promedioVenta).toLocaleString()}
          </p>
        </div>

        <div className={styles.tarjetaEstadistica}>
          <h3>💵 Efectivo</h3>
          <p className={styles.valorGrande}>
            ${estadisticas.porEfectivo.toLocaleString()}
          </p>
        </div>

        <div className={styles.tarjetaEstadistica}>
          <h3>💳 Transferencia</h3>
          <p className={styles.valorGrande}>
            ${estadisticas.porTransferencia.toLocaleString()}
          </p>
        </div>
      </div>

      {/* BOTÓN EXPORTAR */}
      <button
        className={styles.botonExportarReportes}
        onClick={handleExportar}
      >
        📥 Exportar Reporte CSV
      </button>
    </div>
  );
};

export default VistaReportes;
