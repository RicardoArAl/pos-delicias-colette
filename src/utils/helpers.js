// src/utils/helpers.js

export const calcularTiempoTranscurrido = (fechaCreacion) => {
  if (!fechaCreacion || !fechaCreacion.toDate) return 0;
  
  const ahora = new Date();
  const creacion = fechaCreacion.toDate();
  const diferencia = ahora - creacion;
  return Math.floor(diferencia / (1000 * 60)); // minutos
};

export const obtenerColorTiempo = (minutos) => {
  if (minutos < 30) return '#16a34a'; // verde
  if (minutos < 60) return '#f59e0b'; // amarillo
  return '#dc2626'; // rojo
};

export const obtenerVentasFiltradas = (ventas, filtroHistorial, busquedaOrden, autenticado) => {
  let ventasFiltradas = [...ventas];

  // Filtro de autenticación (últimas 24 horas si no está autenticado)
  if (!autenticado) {
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);
    
    ventasFiltradas = ventasFiltradas.filter(venta => {
      const fechaVenta = new Date(venta.fecha + ' ' + venta.hora);
      return fechaVenta >= hace24Horas;
    });
  }

  // Búsqueda por número de orden
  if (busquedaOrden) {
    return ventasFiltradas.filter(v => 
      v.numeroOrden.toString().includes(busquedaOrden)
    );
  }

  // Filtros de tiempo
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  switch (filtroHistorial) {
    case 'hoy':
      return ventasFiltradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        fechaVenta.setHours(0, 0, 0, 0);
        return fechaVenta.getTime() === hoy.getTime();
      });

    case 'semana':
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());
      return ventasFiltradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta >= inicioSemana;
      });

    case 'mes':
      return ventasFiltradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta.getMonth() === hoy.getMonth() &&
               fechaVenta.getFullYear() === hoy.getFullYear();
      });

    case 'todas':
    default:
      return ventasFiltradas;
  }
};

export const exportarCSV = (ventas) => {
  if (ventas.length === 0) {
    alert('No hay ventas para exportar');
    return;
  }

  let csv = 'Orden,Fecha,Hora,Productos,Método Pago,Total\n';
  
  ventas.forEach(venta => {
    const productos = venta.productos
      .map(p => `${p.nombre} x${p.cantidad}`)
      .join(' | ');
    
    csv += `${venta.numeroOrden},${venta.fecha},${venta.hora},"${productos}",${venta.metodoPago},${venta.total}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ventas-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

export const obtenerEstadoStock = (item) => {
  if (item.stock === 0) return 'agotado';
  if (item.stock <= item.stockMinimo) return 'bajo';
  return 'normal';
};