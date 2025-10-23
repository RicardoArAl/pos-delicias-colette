// src/components/reportes/VistaReportes.js
import React from 'react';
import { obtenerVentasFiltradas, exportarCSV, calcularEstadisticas } from '../../utils/helpers';
import { calcularEstadisticas as calcularStats } from '../../utils/calculos';

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
    <div className="vista-reportes">
      <h2>📈 Reportes y Estadísticas</h2>

      <div className="filtros-reportes">
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

      <div className="grid-estadisticas">
        <div className="tarjeta-estadistica">
          <h3>💰 Total Vendido</h3>
          <p className="valor-grande">${estadisticas.totalVendido.toLocaleString()}</p>
        </div>

        <div className="tarjeta-estadistica">
          <h3>🛒 Número de Órdenes</h3>
          <p className="valor-grande">{estadisticas.numeroOrdenes}</p>
        </div>

        <div className="tarjeta-estadistica">
          <h3>📊 Promedio por Venta</h3>
          <p className="valor-grande">${Math.round(estadisticas.promedioVenta).toLocaleString()}</p>
        </div>

        <div className="tarjeta-estadistica">
          <h3>💵 Efectivo</h3>
          <p className="valor-grande">${estadisticas.porEfectivo.toLocaleString()}</p>
        </div>

        <div className="tarjeta-estadistica">
          <h3>💳 Transferencia</h3>
          <p className="valor-grande">${estadisticas.porTransferencia.toLocaleString()}</p>
        </div>
      </div>

      <button className="boton-exportar-reportes" onClick={handleExportar}>
        📥 Exportar Reporte CSV
      </button>
    </div>
  );
};

export default VistaReportes;