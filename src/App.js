import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  guardarVentaFirebase, 
  obtenerVentasFirebase,
  obtenerProximoNumeroOrdenFirebase 
} from './firebaseService';
import { 
  guardarOrdenPendiente,
  obtenerOrdenesPendientes,
  obtenerProximoNumeroOrdenTotal,
  actualizarOrdenPendiente,
  cancelarOrden
} from './firebasePendientes';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
const ProductosMenu = {
  empanadas: [
    { id: 'e1', nombre: 'Arroz pollo', precio: 3000, descripcion: 'Empanada con arroz y pollo' },
    { id: 'e2', nombre: 'Arroz carne', precio: 3000, descripcion: 'Empanada con arroz y carne' },
    { id: 'e3', nombre: 'Papa carne', precio: 3000, descripcion: 'Empanada con papa y carne' },
    { id: 'e4', nombre: 'Pizza', precio: 3500, descripcion: 'Empanada con queso, tocineta y maiz' },
    { id: 'e5', nombre: 'Pollo champiñon', precio: 4000, descripcion: 'Empanada con champiñon y pollo' },
    { id: 'e6', nombre: 'Papa carne/pollo', precio: 4500, descripcion: 'Papa rellena de carne o pollo desmechado' }
  ],
  perros: [
    { id: 'p1', nombre: 'Perro Caliente', precio: 14500, descripcion: 'Salchicha americana, tocineta, queso, papa chip y cebolla caramelizada' },
    { id: 'p2', nombre: 'Choriperro', precio: 14500, descripcion: 'Chorizo, tocineta, queso, papa chip y cebolla caramelizada' },
    { id: 'p3', nombre: 'Perro en Combo', precio: 18500, descripcion: 'Perro caliente con porción de papa y gaseosa Postobón' },
    { id: 'p4', nombre: 'Perro Especial', precio: 20000, descripcion: 'Con carne o pollo desmechado, porción de papa y gaseosa' }
  ],
  hamburguesas: [
    { id: 'h1', nombre: 'Sencilla', precio: 12000, descripcion: 'Carne 100g, lechuga, tomate, cebolla caramelizada y queso' },
    { id: 'h2', nombre: 'Especial', precio: 15000, descripcion: 'Carne 100g, lechuga, tomate, queso, papa chip, tocineta y papas' },
    { id: 'h3', nombre: 'Super Especial', precio: 20000, descripcion: 'Carne 100g, doble queso, plátano, papa chip, tocineta y papas' },
    { id: 'h4', nombre: 'Doble Carne', precio: 30000, descripcion: 'Carne y pechuga, doble queso, plátano/maíz, huevo, tocineta y papas' }
  ],
  combos: [
    { id: 'c1', nombre: 'Combo Perros', precio: 24000, descripcion: 'Dos perros calientes con gaseosa Postobón personal' },
    { id: 'c2', nombre: 'Combo Hamburguesas', precio: 28000, descripcion: 'Dos hamburguesas con porción de papas' }
  ],
  salchipapas: [
    { id: 's1', nombre: 'Salchipapa', precio: 25000, descripcion: 'Papa, plátano, tocineta, proteína, salchicha, lechuga y queso' },
    { id: 's2', nombre: 'Mazorcada', precio: 25000, descripcion: 'Maíz tierno, proteína, tocineta, papa, papa chip, queso y plátano' }
  ],
  platos: [
    { id: 'pl1', nombre: 'Chorizo con Arepa', precio: 7500, descripcion: 'Carne con porción de papas y ensalada' },
    { id: 'pl2', nombre: 'Pechuga a la Plancha', precio: 23000, descripcion: 'Pechuga con porción de papas y ensalada' },
    { id: 'pl3', nombre: 'Carne a la Plancha', precio: 23000, descripcion: 'Chorizo con arepa' },
  ],
  bebidas: [
    { id: 'b1', nombre: 'Gaseosa Postobón', precio: 3000, descripcion: '' },
    { id: 'b2', nombre: 'Coca Cola 250ml', precio: 3500, descripcion: '' },
    { id: 'b3', nombre: 'Coca Cola 350ml', precio: 3000, descripcion: '' },
    { id: 'b4', nombre: 'Postobón 1.5L', precio: 6000, descripcion: '' },
    { id: 'b5', nombre: 'Coca Cola 1.5L', precio: 7500, descripcion: '' },
    { id: 'b6', nombre: 'Cerveza Andina', precio: 3000, descripcion: '' },
    { id: 'b7', nombre: 'Cerveza', precio: 3500, descripcion: '' },
    { id: 'b8', nombre: 'Jugos Hit', precio: 3000, descripcion: '' },
    { id: 'b9', nombre: 'Mr. Tea', precio: 3000, descripcion: '' }
  ]
};

// Función para exportar ventas a CSV
const exportarVentasCSV = (ventas, nombreArchivo = 'ventas') => {
  if (ventas.length === 0) {
    alert('No hay ventas para exportar');
    return;
  }

  const encabezados = [
    'Numero de Orden',
    'Fecha',
    'Hora',
    'Productos',
    'Cantidades',
    'Metodo de Pago',
    'Monto Recibido',
    'Cambio',
    'Total'
  ];

  const filas = ventas.map(venta => {
    const productos = venta.productos.map(p => p.nombre).join('; ');
    const cantidades = venta.productos.map(p => p.cantidad).join('; ');
    
    return [
      venta.numeroOrden,
      venta.fecha,
      venta.hora,
      `"${productos}"`,
      cantidades,
      venta.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia',
      venta.montoRecibido || '',
      venta.cambio || '',
      venta.total
    ];
  });

  const BOM = '\uFEFF';
  let csvContent = BOM + encabezados.join(',') + '\n';
  filas.forEach(fila => {
    csvContent += fila.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const fecha = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${nombreArchivo}_${fecha}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('✅ Archivo CSV descargado:', `${nombreArchivo}_${fecha}.csv`);
};

// Función para exportar reporte resumido
const exportarReporteCSV = (estadisticas, periodo) => {
  const encabezados = ['Metrica', 'Valor'];
  
  const filas = [
    ['Periodo', periodo],
    ['Total Vendido', estadisticas.totalVendido],
    ['Numero de Ordenes', estadisticas.numeroOrdenes],
    ['Promedio por Venta', estadisticas.promedioVenta.toFixed(0)],
    ['Total Efectivo', estadisticas.totalEfectivo],
    ['Total Transferencia', estadisticas.totalTransferencia]
  ];

  const BOM = '\uFEFF';
  let csvContent = BOM + encabezados.join(',') + '\n';
  filas.forEach(fila => {
    csvContent += fila.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const fecha = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `reporte_${periodo}_${fecha}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('✅ Reporte CSV descargado');
};

export default function App() {
  // Estados principales
  const [vistaActual, setVistaActual] = useState('pedidos');
  const [categoriaActiva, setCategoriaActiva] = useState('empanadas');
  const [pedido, setPedido] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  const [ventas, setVentas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('todas');
  const [busquedaOrden, setBusquedaOrden] = useState('');
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [periodoReporte, setPeriodoReporte] = useState('todo');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarDetalleOrden, setMostrarDetalleOrden] = useState(false);
  const [modoAgregarProductos, setModoAgregarProductos] = useState(false);
  const [productosTemporales, setProductosTemporales] = useState([]);
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] = useState(false);
  const [mostrarConfirmacionPendiente, setMostrarConfirmacionPendiente] = useState(false);
  const [numeroOrdenPendiente, setNumeroOrdenPendiente] = useState(null);

  const categorias = [
    { id: 'empanadas', nombre: 'Empanadas', icon: '🥟' },
    { id: 'perros', nombre: 'Perros', icon: '🌭' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icon: '🍔' },
    { id: 'combos', nombre: 'Combos', icon: '🍽️' },
    { id: 'salchipapas', nombre: 'Salchipapas', icon: '🍟' },
    { id: 'platos', nombre: 'Platos', icon: '🍖' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' }
  ];

  // Cargar datos iniciales desde Firebase
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const [ventasFirebase, pendientesFirebase] = await Promise.all([
          obtenerVentasFirebase(),
          obtenerOrdenesPendientes()
        ]);
        
        setVentas(ventasFirebase);
        setTotalVentas(ventasFirebase.length);
        setOrdenesPendientes(pendientesFirebase);
        
        console.log('✅ Ventas cargadas:', ventasFirebase.length);
        console.log('✅ Órdenes pendientes:', pendientesFirebase.length);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        setError('No se pudieron cargar los datos. Intenta recargar la página.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatosIniciales();
  }, []);
  // ========================================
  // FUNCIONES DE MANEJO DE PEDIDOS
  // ========================================

  const agregarProducto = (producto) => {
    const existe = pedido.find(item => item.id === producto.id);
    if (existe) {
      setPedido(pedido.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, cambio) => {
    setPedido(pedido.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + cambio;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const eliminarItem = (id) => {
    setPedido(pedido.filter(item => item.id !== id));
  };

  const limpiarPedido = () => {
    if (pedido.length > 0 && window.confirm('¿Limpiar todo el pedido?')) {
      setPedido([]);
    }
  };

  const calcularTotal = () => {
    return pedido.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularCambio = () => {
    const recibido = parseFloat(montoRecibido) || 0;
    const total = calcularTotal();
    return recibido - total;
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CO')}`;
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO + 'T00:00:00');
    return fecha.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // ========================================
  // FUNCIONES DE PAGO
  // ========================================

  const abrirPantallaPago = () => {
    setMostrarPago(true);
    setMetodoPago('');
    setMontoRecibido('');
  };

  const cerrarPantallaPago = () => {
    setMostrarPago(false);
    setMetodoPago('');
    setMontoRecibido('');
  };

  const agregarBillete = (valor) => {
    const montoActual = parseFloat(montoRecibido) || 0;
    const nuevoMonto = montoActual + valor;
    setMontoRecibido(nuevoMonto.toString());
  };

  const limpiarMontoRecibido = () => {
    setMontoRecibido('');
  };

  const confirmarPago = async () => {
  const esPagoPendiente = ordenSeleccionada !== null;
  
  if (metodoPago === 'efectivo') {
    const cambio = calcularCambio();
    if (cambio < 0) {
      alert('El monto recibido es menor al total');
      return;
    }
  }

  try {
    const nuevaOrden = esPagoPendiente 
      ? ordenSeleccionada.numeroOrden 
      : obtenerProximoNumeroOrdenFirebase(ventas);
    
    const ahora = new Date();
    
    const venta = {
      id: esPagoPendiente ? ordenSeleccionada.id : `venta-${Date.now()}`,
      numeroOrden: nuevaOrden,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0],
      productos: pedido.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      metodoPago: metodoPago,
      montoRecibido: metodoPago === 'efectivo' ? parseFloat(montoRecibido) : null,
      cambio: metodoPago === 'efectivo' ? calcularCambio() : null,
      total: calcularTotal()
    };

    await guardarVentaFirebase(venta);
    
    // ✅ Marcar orden como pagada si es pendiente
    if (esPagoPendiente) {
      const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
      await updateDoc(ordenRef, {
        estado: 'pagada',
        metodoPago: metodoPago,
        montoRecibido: metodoPago === 'efectivo' ? parseFloat(montoRecibido) : null,
        cambio: metodoPago === 'efectivo' ? calcularCambio() : null,
        fechaPago: venta.fecha,
        horaPago: venta.hora
      });

      const pendientesActualizadas = await obtenerOrdenesPendientes();
      setOrdenesPendientes(pendientesActualizadas);
    }

    const ventasActualizadas = await obtenerVentasFirebase();
    setVentas(ventasActualizadas);
    setTotalVentas(ventasActualizadas.length);
    
    setNumeroOrden(nuevaOrden);
    setPagoExitoso(true);

    setTimeout(() => {
      setPagoExitoso(false);
      setMostrarPago(false);
      setPedido([]);
      setMetodoPago('');
      setMontoRecibido('');
      setNumeroOrden(null);
      setOrdenSeleccionada(null);
    }, 3000);

  } catch (error) {
    console.error('❌ Error al procesar el pago:', error);
    alert('Hubo un error al guardar la venta. Por favor, intenta de nuevo.');
  }
};

  // ========================================
  // FUNCIONES DE ÓRDENES PENDIENTES
  // ========================================

const guardarComoPendiente = async () => {
  if (pedido.length === 0) {
    alert('El pedido está vacío');
    return;
  }

  try {
    const nuevaOrden = obtenerProximoNumeroOrdenTotal(ventas, ordenesPendientes);
    const ahora = new Date();
    
    // ✅ ESTRUCTURA CORRECTA: usar "productos" directamente
    const ordenPendiente = {
      numeroOrden: nuevaOrden,
      estado: 'pendiente',
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0],
      
      // ✅ Usar "productos" en lugar de "itemsAgregados"
      productos: pedido.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      
      total: calcularTotal(),
      cantidadProductos: pedido.reduce((sum, item) => sum + item.cantidad, 0),
      
      // Campos de pago (se llenarán cuando se pague)
      metodoPago: null,
      montoRecibido: null,
      cambio: null,
      fechaPago: null,
      horaPago: null
    };

    await guardarOrdenPendiente(ordenPendiente);

    const pendientesActualizadas = await obtenerOrdenesPendientes();
    setOrdenesPendientes(pendientesActualizadas);
    
    setNumeroOrdenPendiente(nuevaOrden);
    setMostrarConfirmacionPendiente(true);

    setTimeout(() => {
      setMostrarConfirmacionPendiente(false);
      setPedido([]);
      setNumeroOrdenPendiente(null);
    }, 2000);

    console.log('✅ Orden guardada como pendiente:', nuevaOrden);
  } catch (error) {
    console.error('❌ Error al guardar orden pendiente:', error);
    alert('Hubo un error al guardar la orden. Por favor, intenta de nuevo.');
  }
};

  const abrirDetalleOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarDetalleOrden(true);
  };

  const cerrarDetalleOrden = () => {
    setOrdenSeleccionada(null);
    setMostrarDetalleOrden(false);
    setModoAgregarProductos(false);
    setProductosTemporales([]);
  };

  const procesarPagoPendiente = (orden) => {
  // ✅ Validar que productos exista y sea un array
  const productosOrden = orden.productos || [];
  
  if (productosOrden.length === 0) {
    alert('Esta orden no tiene productos asociados');
    return;
  }
  
  setPedido(productosOrden);
  setOrdenSeleccionada(orden);
  setMostrarDetalleOrden(false);
  setMostrarPago(true);
};

  const solicitarCancelarOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarConfirmacionCancelar(true);
  };

  const cancelarOrdenPendiente = async () => {
  try {
    const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
    await updateDoc(ordenRef, {
      estado: 'cancelada',
      fechaCancelacion: new Date().toISOString().split('T')[0],
      horaCancelacion: new Date().toTimeString().split(' ')[0]
    });

    const pendientesActualizadas = await obtenerOrdenesPendientes();
    setOrdenesPendientes(pendientesActualizadas);

    setMostrarConfirmacionCancelar(false);
    setMostrarDetalleOrden(false);
    setOrdenSeleccionada(null);

    alert('✅ Orden cancelada');

  } catch (error) {
    console.error('Error al cancelar orden:', error);
    alert('❌ Error al cancelar orden');
  }
};
  // ========================================
  // FUNCIONES DE AGREGAR PRODUCTOS A ORDEN
  // ========================================

  const iniciarAgregarProductos = () => {
    setModoAgregarProductos(true);
    setProductosTemporales([]);
    setVistaActual('pedidos');
    setMostrarDetalleOrden(false);
  };

  const agregarProductoTemporal = (producto) => {
    const productoExistente = productosTemporales.find(p => p.id === producto.id);
    
    if (productoExistente) {
      setProductosTemporales(productosTemporales.map(p =>
        p.id === producto.id 
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ));
    } else {
      setProductosTemporales([...productosTemporales, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProductoTemporal = (productoId) => {
    const producto = productosTemporales.find(p => p.id === productoId);
    
    if (producto && producto.cantidad > 1) {
      setProductosTemporales(productosTemporales.map(p =>
        p.id === productoId
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      ));
    } else {
      setProductosTemporales(productosTemporales.filter(p => p.id !== productoId));
    }
  };

  const cancelarAgregarProductos = () => {
    setModoAgregarProductos(false);
    setProductosTemporales([]);
    setVistaActual('pendientes');
  };

  const confirmarProductosAgregados = async () => {
  if (productosTemporales.length === 0) {
    alert('Debes agregar al menos un producto');
    return;
  }

  try {
    // ✅ Validar que productos exista
    const productosActuales = ordenSeleccionada.productos || [];
    const productosActualizados = [...productosActuales];
    
    productosTemporales.forEach(nuevoProducto => {
      const existente = productosActualizados.find(p => p.id === nuevoProducto.id);
      
      if (existente) {
        existente.cantidad += nuevoProducto.cantidad;
      } else {
        productosActualizados.push(nuevoProducto);
      }
    });

    const nuevoTotal = productosActualizados.reduce((sum, p) => 
      sum + (p.precio * p.cantidad), 0
    );

    const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
    await updateDoc(ordenRef, {
      productos: productosActualizados,
      total: nuevoTotal,
      cantidadProductos: productosActualizados.reduce((sum, p) => sum + p.cantidad, 0),
      ultimaActualizacion: Timestamp.now()
    });

    const pendientesActualizadas = await obtenerOrdenesPendientes();
    setOrdenesPendientes(pendientesActualizadas);

    setModoAgregarProductos(false);
    setProductosTemporales([]);
    setOrdenSeleccionada(null);
    setVistaActual('pendientes');
    alert('✅ Productos agregados exitosamente');

  } catch (error) {
    console.error('Error al agregar productos:', error);
    alert('❌ Error al agregar productos');
  }
};
  // ========================================
  // FUNCIONES DE FILTROS Y ESTADÍSTICAS
  // ========================================

  const filtrarVentas = () => {
    let ventasFiltradas = [...ventas];

    if (filtroFecha !== 'todas') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      ventasFiltradas = ventasFiltradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha + 'T00:00:00');
        
        if (filtroFecha === 'hoy') {
          return fechaVenta.getTime() === hoy.getTime();
        } else if (filtroFecha === 'semana') {
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - hoy.getDay());
          return fechaVenta >= inicioSemana;
        } else if (filtroFecha === 'mes') {
          return fechaVenta.getMonth() === hoy.getMonth() && 
                 fechaVenta.getFullYear() === hoy.getFullYear();
        }
        return true;
      });
    }

    if (busquedaOrden) {
      ventasFiltradas = ventasFiltradas.filter(venta => 
        venta.numeroOrden.toString().includes(busquedaOrden)
      );
    }

    return ventasFiltradas.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.hora);
      const fechaB = new Date(b.fecha + 'T' + b.hora);
      return fechaB - fechaA;
    });
  };

  const filtrarVentasPorPeriodo = () => {
    let ventasFiltradas = [...ventas];

    if (periodoReporte !== 'todo') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      ventasFiltradas = ventasFiltradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha + 'T00:00:00');
        
        if (periodoReporte === 'hoy') {
          return fechaVenta.getTime() === hoy.getTime();
        } else if (periodoReporte === 'semana') {
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - hoy.getDay());
          return fechaVenta >= inicioSemana;
        } else if (periodoReporte === 'mes') {
          return fechaVenta.getMonth() === hoy.getMonth() && 
                 fechaVenta.getFullYear() === hoy.getFullYear();
        }
        return true;
      });
    }

    return ventasFiltradas;
  };

  const calcularEstadisticas = () => {
    const ventasDelPeriodo = filtrarVentasPorPeriodo();
    
    const totalVendido = ventasDelPeriodo.reduce((sum, v) => sum + v.total, 0);
    const totalEfectivo = ventasDelPeriodo
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + v.total, 0);
    const totalTransferencia = ventasDelPeriodo
      .filter(v => v.metodoPago === 'transferencia')
      .reduce((sum, v) => sum + v.total, 0);
    
    const numeroOrdenes = ventasDelPeriodo.length;
    const promedioVenta = numeroOrdenes > 0 ? totalVendido / numeroOrdenes : 0;

    const productosVendidos = {};
    ventasDelPeriodo.forEach(venta => {
      venta.productos.forEach(prod => {
        if (productosVendidos[prod.nombre]) {
          productosVendidos[prod.nombre] += prod.cantidad;
        } else {
          productosVendidos[prod.nombre] = prod.cantidad;
        }
      });
    });

    const topProductos = Object.entries(productosVendidos)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return {
      totalVendido,
      totalEfectivo,
      totalTransferencia,
      numeroOrdenes,
      promedioVenta,
      topProductos
    };
  };

  const ventasFiltradas = filtrarVentas();
  const estadisticas = calcularEstadisticas();

  // ========================================
  // PANTALLAS DE CARGA Y ERROR
  // ========================================

  if (cargando) {
    return (
      <div className="app-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '4rem',
          animation: 'spin 1s linear infinite'
        }}>⏳</div>
        <h2>Cargando sistema POS...</h2>
        <p style={{ color: '#6b7280' }}>Conectando con Firebase</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '4rem' }}>⚠️</div>
        <h2>Error al cargar datos</h2>
        <p style={{ color: '#dc2626', textAlign: 'center', maxWidth: '500px' }}>
          {error}
        </p>
        <button 
          className="btn-pagar"
          onClick={() => window.location.reload()}
          style={{ width: 'auto', padding: '15px 30px' }}
        >
          Reintentar
        </button>
      </div>
    );
  }
// ========================================
  // VISTA: PEDIDOS (PRINCIPAL)
  // ========================================

  if (vistaActual === 'pedidos') {
    return (
      <div className="app-container">
        <div className="main-panel">
          <div className="header">
            <div className="header-content">
              <div>
                <h1>🍔 Delicias de Colette</h1>
                <p className="subtitle">Sistema POS - Toma de Pedidos</p>
              </div>
              <div className="header-actions">
                <button 
                  className="btn-reportes"
                  onClick={() => setVistaActual('reportes')}
                >
                  📊 Reportes
                </button>
                <button 
                  className="btn-historial"
                  onClick={() => setVistaActual('historial')}
                >
                  📋 Historial
                </button>
                <button 
                  className="btn-pendientes"
                  onClick={() => setVistaActual('pendientes')}
                >
                  🧾 Pendientes {ordenesPendientes.length > 0 && `(${ordenesPendientes.length})`}
                </button>
                <div className="stats-badge">
                  <span className="stats-label">Ventas totales:</span>
                  <span className="stats-number">{totalVentas}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="categorias-container">
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`categoria-btn ${categoriaActiva === cat.id ? 'activa' : ''}`}
              >
                <span className="categoria-icon">{cat.icon}</span>
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="productos-container">
            <div className="productos-grid">
              {ProductosMenu[categoriaActiva].map(producto => (
                <button
                  key={producto.id}
                  onClick={() => {
                    if (modoAgregarProductos) {
                      agregarProductoTemporal(producto);
                    } else {
                      agregarProducto(producto);
                    }
                  }}
                  className="producto-card"
                >
                  <h3>{producto.nombre}</h3>
                  {producto.descripcion && (
                    <p className="producto-descripcion">{producto.descripcion}</p>
                  )}
                  <p className="producto-precio">{formatearPrecio(producto.precio)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pedido-panel">
          <div className="pedido-header">
            <div className="pedido-header-top">
              <h2>🛒 {modoAgregarProductos ? 'Agregar Productos' : 'Pedido Actual'}</h2>
              <button
                onClick={() => {
                  if (modoAgregarProductos) {
                    setProductosTemporales([]);
                  } else {
                    limpiarPedido();
                  }
                }}
                className="btn-limpiar"
                disabled={modoAgregarProductos ? productosTemporales.length === 0 : pedido.length === 0}
              >
                🗑️ Limpiar
              </button>
            </div>
            <p className="pedido-count">
              {modoAgregarProductos ? productosTemporales.length : pedido.length} item(s)
            </p>
          </div>

          <div className="pedido-items">
            {modoAgregarProductos ? (
              productosTemporales.length === 0 ? (
                <div className="pedido-vacio">
                  <div className="carrito-vacio">➕</div>
                  <p className="texto-vacio">Selecciona productos</p>
                  <p className="texto-vacio-small">Para agregar a la orden #{ordenSeleccionada?.numeroOrden}</p>
                </div>
              ) : (
                <div className="items-lista">
                  {productosTemporales.map(item => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h4>{item.nombre}</h4>
                          <p className="item-precio">{formatearPrecio(item.precio)}</p>
                        </div>
                        <button
                          onClick={() => setProductosTemporales(productosTemporales.filter(p => p.id !== item.id))}
                          className="btn-eliminar"
                        >
                          ❌
                        </button>
                      </div>
                      
                      <div className="item-controls">
                        <div className="cantidad-control">
                          <button
                            onClick={() => quitarProductoTemporal(item.id)}
                            className="btn-cantidad btn-menos"
                          >
                            −
                          </button>
                          <span className="cantidad">{item.cantidad}</span>
                          <button
                            onClick={() => agregarProductoTemporal(item)}
                            className="btn-cantidad btn-mas"
                          >
                            +
                          </button>
                        </div>
                        <div className="subtotal">
                          <p className="subtotal-label">Subtotal</p>
                          <p className="subtotal-valor">
                            {formatearPrecio(item.precio * item.cantidad)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              pedido.length === 0 ? (
                <div className="pedido-vacio">
                  <div className="carrito-vacio">🛒</div>
                  <p className="texto-vacio">Pedido vacío</p>
                  <p className="texto-vacio-small">Toca un producto para agregarlo</p>
                </div>
              ) : (
                <div className="items-lista">
                  {pedido.map(item => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h4>{item.nombre}</h4>
                          <p className="item-precio">{formatearPrecio(item.precio)}</p>
                        </div>
                        <button
                          onClick={() => eliminarItem(item.id)}
                          className="btn-eliminar"
                        >
                          ❌
                        </button>
                      </div>
                      
                      <div className="item-controls">
                        <div className="cantidad-control">
                          <button
                            onClick={() => cambiarCantidad(item.id, -1)}
                            className="btn-cantidad btn-menos"
                          >
                            −
                          </button>
                          <span className="cantidad">{item.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(item.id, 1)}
                            className="btn-cantidad btn-mas"
                          >
                            +
                          </button>
                        </div>
                        <div className="subtotal">
                          <p className="subtotal-label">Subtotal</p>
                          <p className="subtotal-valor">
                            {formatearPrecio(item.precio * item.cantidad)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          <div className="pedido-footer">
            {modoAgregarProductos ? (
              <>
                <div className="total-container">
                  <span className="total-label">SUBTOTAL</span>
                  <span className="total-valor">
                    {formatearPrecio(productosTemporales.reduce((sum, item) => 
                      sum + (item.precio * item.cantidad), 0))}
                  </span>
                </div>
                <div className="pedido-footer-botones">
                  <button
                    className="btn-cancelar"
                    onClick={cancelarAgregarProductos}
                  >
                    ← Cancelar
                  </button>
                  <button
                    disabled={productosTemporales.length === 0}
                    className="btn-pagar"
                    onClick={confirmarProductosAgregados}
                  >
                    ✓ Confirmar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="total-container">
                  <span className="total-label">TOTAL</span>
                  <span className="total-valor">
                    {formatearPrecio(calcularTotal())}
                  </span>
                </div>
                <div className="pedido-footer-botones">
                  <button
                    disabled={pedido.length === 0}
                    className="btn-pendiente"
                    onClick={guardarComoPendiente}
                    title="Guardar orden para pagar después"
                  >
                    📝 Guardar Pendiente
                  </button>
                  <button
                    disabled={pedido.length === 0}
                    className="btn-pagar"
                    onClick={abrirPantallaPago}
                  >
                    💳 Pagar Ahora
                  </button>
                </div>
                <p className="fase-label">Sistema de Órdenes Pendientes</p>
              </>
            )}
          </div>
        </div>

        {/* Modal de confirmación pendiente */}
        {mostrarConfirmacionPendiente && (
          <div className="modal-overlay">
            <div className="modal-confirmacion-pendiente">
              <div className="icono-pendiente">📝</div>
              <h2>¡Orden Guardada!</h2>
              <p className="numero-orden-pendiente">Orden #{numeroOrdenPendiente}</p>
              <p className="mensaje-pendiente">
                La orden ha sido guardada como pendiente
              </p>
              <p className="submensaje-pendiente">
                Puedes agregar más productos o procesarla desde "Pendientes"
              </p>
            </div>
          </div>
        )}

        {/* Modal de pago */}
        {mostrarPago && (
          <div className="modal-overlay">
            <div className="modal-pago">
              {!pagoExitoso ? (
                <>
                  <div className="modal-header">
                    <h2>💳 Procesar Pago</h2>
                    <button onClick={cerrarPantallaPago} className="btn-cerrar">✕</button>
                  </div>

                  <div className="modal-body">
                    <div className="resumen-pedido">
                      <h3>Resumen del Pedido</h3>
                      <div className="resumen-items">
                        {pedido.map(item => (
                          <div key={item.id} className="resumen-item">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="resumen-total">
                        <span>TOTAL</span>
                        <span>{formatearPrecio(calcularTotal())}</span>
                      </div>
                    </div>

                    <div className="metodo-pago-section">
                      <h3>Método de Pago</h3>
                      <div className="metodos-pago">
                        <button
                          className={`metodo-btn ${metodoPago === 'efectivo' ? 'activo' : ''}`}
                          onClick={() => setMetodoPago('efectivo')}
                        >
                          <span className="metodo-icon">💵</span>
                          <span>Efectivo</span>
                        </button>
                        <button
                          className={`metodo-btn ${metodoPago === 'transferencia' ? 'activo' : ''}`}
                          onClick={() => setMetodoPago('transferencia')}
                        >
                          <span className="metodo-icon">📱</span>
                          <span>Transferencia</span>
                        </button>
                      </div>
                    </div>

                    {metodoPago === 'efectivo' && (
                      <div className="efectivo-section">
                        <div className="monto-display">
                          <label>Monto Recibido</label>
                          <div className="monto-valor">
                            {montoRecibido ? formatearPrecio(parseFloat(montoRecibido)) : '$0'}
                          </div>
                          <button
                            type="button"
                            className="btn-limpiar-monto"
                            onClick={limpiarMontoRecibido}
                          >
                            🗑️ Limpiar
                          </button>
                        </div>

                        <label className="billetes-label">Selecciona los billetes:</label>
                        <div className="billetes-grid">
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(2000)}>
                            + $2.000
                          </button>
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(5000)}>
                            + $5.000
                          </button>
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(10000)}>
                            + $10.000
                          </button>
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(20000)}>
                            + $20.000
                          </button>
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(50000)}>
                            + $50.000
                          </button>
                          <button type="button" className="billete-btn" onClick={() => agregarBillete(100000)}>
                            + $100.000
                          </button>
                        </div>
                        
                        {montoRecibido && (
                          <div className="cambio-info">
                            <span>Cambio:</span>
                            <span className={calcularCambio() < 0 ? 'cambio-negativo' : 'cambio-positivo'}>
                              {formatearPrecio(calcularCambio())}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {metodoPago === 'transferencia' && (
                      <div className="transferencia-info">
                        <p>✅ Confirme que recibió la transferencia</p>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button onClick={cerrarPantallaPago} className="btn-cancelar">
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarPago}
                      className="btn-confirmar"
                      disabled={!metodoPago || (metodoPago === 'efectivo' && calcularCambio() < 0)}
                    >
                      Confirmar Pago
                    </button>
                  </div>
                </>
              ) : (
                <div className="pago-exitoso">
                  <div className="check-animation">✓</div>
                  <h2>¡Pago Exitoso!</h2>
                  <p className="numero-orden">Orden #{numeroOrden}</p>
                  <p className="mensaje-exito">El pedido ha sido procesado y guardado correctamente</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  // ========================================
  // VISTA: REPORTES
  // ========================================

  if (vistaActual === 'reportes') {
    return (
      <div className="app-container reportes-view">
        <div className="reportes-container">
          <div className="reportes-header">
            <div className="reportes-header-top">
              <h1>📊 Reportes y Estadísticas</h1>
              <div className="reportes-header-actions">
                <button 
                  className="btn-exportar"
                  onClick={() => exportarReporteCSV(estadisticas, periodoReporte)}
                  disabled={estadisticas.numeroOrdenes === 0}
                >
                  📥 Exportar Reporte
                </button>
                <button 
                  className="btn-volver"
                  onClick={() => setVistaActual('pedidos')}
                >
                  ← Volver a Pedidos
                </button>
              </div>
            </div>

            <div className="reportes-filtro">
              <label>Período:</label>
              <div className="periodo-botones">
                <button 
                  className={`periodo-btn ${periodoReporte === 'hoy' ? 'activo' : ''}`}
                  onClick={() => setPeriodoReporte('hoy')}
                >
                  Hoy
                </button>
                <button 
                  className={`periodo-btn ${periodoReporte === 'semana' ? 'activo' : ''}`}
                  onClick={() => setPeriodoReporte('semana')}
                >
                  Esta Semana
                </button>
                <button 
                  className={`periodo-btn ${periodoReporte === 'mes' ? 'activo' : ''}`}
                  onClick={() => setPeriodoReporte('mes')}
                >
                  Este Mes
                </button>
                <button 
                  className={`periodo-btn ${periodoReporte === 'todo' ? 'activo' : ''}`}
                  onClick={() => setPeriodoReporte('todo')}
                >
                  Todo
                </button>
              </div>
            </div>
          </div>

          <div className="reportes-contenido">
            {estadisticas.numeroOrdenes === 0 ? (
              <div className="reportes-vacio">
                <div className="icono-vacio">📊</div>
                <p>No hay ventas en este período</p>
                <p className="texto-small">Realiza algunas ventas para ver estadísticas</p>
              </div>
            ) : (
              <>
                <div className="metricas-grid">
                  <div className="metrica-card principal">
                    <div className="metrica-icono">💰</div>
                    <div className="metrica-info">
                      <span className="metrica-label">Total Vendido</span>
                      <span className="metrica-valor">{formatearPrecio(estadisticas.totalVendido)}</span>
                    </div>
                  </div>

                  <div className="metrica-card">
                    <div className="metrica-icono">🛒</div>
                    <div className="metrica-info">
                      <span className="metrica-label">Número de Órdenes</span>
                      <span className="metrica-valor">{estadisticas.numeroOrdenes}</span>
                    </div>
                  </div>

                  <div className="metrica-card">
                    <div className="metrica-icono">📈</div>
                    <div className="metrica-info">
                      <span className="metrica-label">Promedio por Venta</span>
                      <span className="metrica-valor">{formatearPrecio(estadisticas.promedioVenta)}</span>
                    </div>
                  </div>
                </div>

                <div className="seccion-reporte">
                  <h2>💳 Desglose por Método de Pago</h2>
                  <div className="metodos-pago-grid">
                    <div className="metodo-pago-card efectivo">
                      <div className="metodo-pago-header">
                        <span className="metodo-pago-icono">💵</span>
                        <span className="metodo-pago-nombre">Efectivo</span>
                      </div>
                      <div className="metodo-pago-monto">
                        {formatearPrecio(estadisticas.totalEfectivo)}
                      </div>
                      <div className="metodo-pago-porcentaje">
                        {estadisticas.totalVendido > 0 
                          ? ((estadisticas.totalEfectivo / estadisticas.totalVendido) * 100).toFixed(1)
                          : 0}% del total
                      </div>
                    </div>

                    <div className="metodo-pago-card transferencia">
                      <div className="metodo-pago-header">
                        <span className="metodo-pago-icono">📱</span>
                        <span className="metodo-pago-nombre">Transferencia</span>
                      </div>
                      <div className="metodo-pago-monto">
                        {formatearPrecio(estadisticas.totalTransferencia)}
                      </div>
                      <div className="metodo-pago-porcentaje">
                        {estadisticas.totalVendido > 0 
                          ? ((estadisticas.totalTransferencia / estadisticas.totalVendido) * 100).toFixed(1)
                          : 0}% del total
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // VISTA: ÓRDENES PENDIENTES
  // ========================================

  if (vistaActual === 'pendientes') {
    return (
      <div className="app-container pendientes-view">
        <div className="pendientes-container">
          <div className="pendientes-header">
            <div className="pendientes-header-top">
              <h1>🧾 Órdenes Pendientes</h1>
              <button 
                className="btn-volver"
                onClick={() => setVistaActual('pedidos')}
              >
                ← Volver a Pedidos
              </button>
            </div>

            <div className="pendientes-stats">
              <div className="stat-pendiente">
                <span className="stat-pendiente-label">Total pendientes</span>
                <span className="stat-pendiente-valor">{ordenesPendientes.length}</span>
              </div>
              <div className="stat-pendiente">
                <span className="stat-pendiente-label">Monto total</span>
                <span className="stat-pendiente-valor">
                  {formatearPrecio(ordenesPendientes.reduce((sum, o) => sum + o.total, 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="pendientes-contenido">
            {ordenesPendientes.length === 0 ? (
              <div className="pendientes-vacio">
                <div className="icono-vacio">🧾</div>
                <p>No hay órdenes pendientes</p>
                <p className="texto-small">Las órdenes que guardes aparecerán aquí</p>
                <button 
                  className="btn-crear-orden"
                  onClick={() => setVistaActual('pedidos')}
                >
                  + Crear Nueva Orden
                </button>
              </div>
            ) : (
              <div className="pendientes-grid">
                {ordenesPendientes.map(orden => {
                  const fechaCreacion = orden.fechaCreacion?.toDate() || new Date();
                  const ahora = new Date();
                  const minutosTranscurridos = Math.floor((ahora - fechaCreacion) / 1000 / 60);
                  
                  let tiempoClase = 'tiempo-reciente';
                  if (minutosTranscurridos > 60) tiempoClase = 'tiempo-antiguo';
                  else if (minutosTranscurridos > 30) tiempoClase = 'tiempo-medio';

                  return (
                    <div key={orden.firebaseId} className="orden-pendiente-card">
                      <div className="orden-pendiente-header">
                        <div className="orden-numero">
                          <span className="orden-label">Orden</span>
                          <span className="orden-numero-valor">#{orden.numeroOrden}</span>
                        </div>
                        <div className={`orden-tiempo ${tiempoClase}`}>
                          <span className="icono-reloj">🕐</span>
                          <span>
                            {minutosTranscurridos < 60 
                              ? `${minutosTranscurridos} min` 
                              : `${Math.floor(minutosTranscurridos / 60)}h ${minutosTranscurridos % 60}m`
                            }
                          </span>
                        </div>
                      </div>

                      <div className="orden-pendiente-info">
                        <div className="orden-detalle">
                          <span className="detalle-icono">🍽️</span>
                          <span>{orden.cantidadProductos} producto(s)</span>
                        </div>
                        <div className="orden-detalle">
                          <span className="detalle-icono">📅</span>
                          <span>{orden.hora}</span>
                        </div>
                      </div>

                      <div className="orden-pendiente-productos">
                        {/* ✅ Validar que productos exista */}
                        {orden.productos && orden.productos.length > 0 ? (
                          <>
                            {orden.productos.slice(0, 3).map((prod, pIdx) => (
                              <div key={pIdx} className="producto-mini">
                                <span className="producto-mini-cantidad">{prod.cantidad}x</span>
                                <span className="producto-mini-nombre">{prod.nombre}</span>
                              </div>
                            ))}
                            {orden.productos.length > 3 && (
                              <div className="producto-mini-mas">
                                +{orden.productos.length - 3} más
                              </div>
                            )}
                          </>
  ) : (
    <div className="producto-mini-mas">Sin productos</div>
  )}
</div>

                      <div className="orden-pendiente-total">
                        <span className="total-label-pendiente">Total</span>
                        <span className="total-valor-pendiente">
                          {formatearPrecio(orden.total)}
                        </span>
                      </div>

                      <div className="orden-acciones">
                        <button 
                          className="btn-detalle"
                          onClick={(e) => {
                          e.stopPropagation();
                          abrirDetalleOrden(orden);
                        }}
                        >
                          👁️ Ver Detalle
                        </button>

                        <button 
                          className="btn-agregar"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOrdenSeleccionada(orden);
                            iniciarAgregarProductos();
                          }}
                        >
                          ➕ Agregar
                        </button>

                        <button 
                          className="btn-pagar"
                          onClick={(e) => {
                            e.stopPropagation();
                            procesarPagoPendiente(orden);
                          }}
                        >
                          💳 Pagar
                        </button>

                        <button 
                          className="btn-cancelar"
                          onClick={(e) => {
                            e.stopPropagation();
                            solicitarCancelarOrden(orden);
                          }}
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalle de orden */}
        {mostrarDetalleOrden && ordenSeleccionada && (
  <div className="modal-overlay" onClick={cerrarDetalleOrden}>
    <div className="modal-detalle-orden" onClick={(e) => e.stopPropagation()}>
      
      <div className="modal-detalle-header">
        <h2>📋 Orden #{ordenSeleccionada.numeroOrden}</h2>
        <button className="btn-cerrar-modal" onClick={cerrarDetalleOrden}>✕</button>
      </div>

      <div className="modal-detalle-info">
        <div className="info-item">
          <span className="info-label">📅 Fecha:</span>
          <span>{ordenSeleccionada.fecha}</span>
        </div>
        <div className="info-item">
          <span className="info-label">🕐 Hora:</span>
          <span>{ordenSeleccionada.hora}</span>
        </div>
        <div className="info-item">
          <span className="info-label">⏱️ Tiempo:</span>
          <span>
            {(() => {
              const ahora = new Date();
              const creacion = ordenSeleccionada.fechaCreacion?.toDate() || new Date();
              const diffMs = ahora - creacion;
              const diffMins = Math.floor(diffMs / 60000);
              if (diffMins < 60) return `${diffMins} min`;
              const diffHours = Math.floor(diffMins / 60);
              return `${diffHours}h ${diffMins % 60}m`;
            })()}
          </span>
        </div>
      </div>

      {/* ✅ Validación de productos */}
      <div className="modal-detalle-productos">
        <h3>Productos:</h3>
        {ordenSeleccionada.productos && ordenSeleccionada.productos.length > 0 ? (
          ordenSeleccionada.productos.map((prod, index) => (
            <div key={index} className="detalle-producto-item">
              <span className="prod-cantidad">{prod.cantidad}x</span>
              <span className="prod-nombre">{prod.nombre}</span>
              <span className="prod-precio">
                {formatearPrecio(prod.precio * prod.cantidad)}
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
            No hay productos en esta orden
          </p>
        )}
      </div>

      <div className="modal-detalle-total">
        <span>TOTAL:</span>
        <span className="total-valor">
          {formatearPrecio(ordenSeleccionada.total)}
        </span>
      </div>

      <div className="modal-detalle-acciones">
        <button 
          className="btn-modal-agregar"
          onClick={() => {
            setMostrarDetalleOrden(false);
            iniciarAgregarProductos();
          }}
        >
          ➕ Agregar Productos
        </button>
        
        <button 
          className="btn-modal-pagar"
          onClick={() => procesarPagoPendiente(ordenSeleccionada)}
        >
          💳 Procesar Pago
        </button>
        
        <button 
          className="btn-modal-cancelar"
          onClick={() => {
            setMostrarDetalleOrden(false);
            solicitarCancelarOrden(ordenSeleccionada);
          }}
        >
          ❌ Cancelar Orden
        </button>
      </div>

    </div>
  </div>
)}

        {/* Modal de confirmación de cancelación */}
        {mostrarConfirmacionCancelar && ordenSeleccionada && (
          <div className="modal-overlay">
            <div className="modal-confirmacion-pendiente">
              <div className="icono-pendiente" style={{ background: '#dc2626' }}>⚠️</div>
              <h2>¿Cancelar Orden?</h2>
              <p className="numero-orden-pendiente">Orden #{ordenSeleccionada.numeroOrden}</p>
              <p className="mensaje-pendiente">
                Esta acción no se puede deshacer
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%' }}>
                <button 
                  className="btn-cancelar"
                  onClick={() => setMostrarConfirmacionCancelar(false)}
                  style={{ flex: 1 }}
                >
                  No, Mantener
                </button>
                <button 
                  className="btn-confirmar"
                  onClick={cancelarOrdenPendiente}
                  style={{ flex: 1, background: '#dc2626' }}
                >
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // VISTA: HISTORIAL DE VENTAS
  // ========================================

  return (
    <div className="app-container historial-view">
      <div className="historial-container">
        <div className="historial-header">
          <div className="historial-header-top">
            <h1>📋 Historial de Ventas</h1>
            <div className="historial-header-actions">
              <button 
                className="btn-exportar"
                onClick={() => exportarVentasCSV(ventasFiltradas, 'historial_ventas')}
                disabled={ventasFiltradas.length === 0}
              >
                📥 Exportar a CSV
              </button>
              <button 
                className="btn-volver"
                onClick={() => {
                  setVistaActual('pedidos');
                  setVentaSeleccionada(null);
                }}
              >
                ← Volver a Pedidos
              </button>
            </div>
          </div>

          <div className="historial-filtros">
            <div className="filtro-grupo">
              <label>Filtrar por fecha:</label>
              <div className="filtro-botones">
                <button 
                  className={`filtro-btn ${filtroFecha === 'todas' ? 'activo' : ''}`}
                  onClick={() => setFiltroFecha('todas')}
                >
                  Todas
                </button>
                <button 
                  className={`filtro-btn ${filtroFecha === 'hoy' ? 'activo' : ''}`}
                  onClick={() => setFiltroFecha('hoy')}
                >
                  Hoy
                </button>
                <button 
                  className={`filtro-btn ${filtroFecha === 'semana' ? 'activo' : ''}`}
                  onClick={() => setFiltroFecha('semana')}
                >
                  Esta Semana
                </button>
                <button 
                  className={`filtro-btn ${filtroFecha === 'mes' ? 'activo' : ''}`}
                  onClick={() => setFiltroFecha('mes')}
                >
                  Este Mes
                </button>
              </div>
            </div>

            <div className="filtro-grupo">
              <label>Buscar por número de orden:</label>
              <input
                type="text"
                className="input-busqueda"
                placeholder="Ej: 1001"
                value={busquedaOrden}
                onChange={(e) => setBusquedaOrden(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="historial-contenido">
          {ventasFiltradas.length === 0 ? (
            <div className="historial-vacio">
              <div className="icono-vacio">📭</div>
              <p>No se encontraron ventas</p>
              <p className="texto-small">
                {busquedaOrden ? 'Intenta con otro número de orden' : 'Aún no hay ventas registradas'}
              </p>
            </div>
          ) : (
            <>
              <div className="historial-stats">
                <div className="stat-card">
                  <span className="stat-label">Ventas encontradas</span>
                  <span className="stat-valor">{ventasFiltradas.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total vendido</span>
                  <span className="stat-valor">
                    {formatearPrecio(ventasFiltradas.reduce((sum, v) => sum + v.total, 0))}
                  </span>
                </div>
              </div>

              <div className="ventas-lista">
                {ventasFiltradas.map(venta => (
                  <div 
                    key={venta.id} 
                    className="venta-card"
                    onClick={() => setVentaSeleccionada(venta)}
                  >
                    <div className="venta-header">
                      <span className="venta-orden">Orden #{venta.numeroOrden}</span>
                      <span className="venta-total">{formatearPrecio(venta.total)}</span>
                    </div>
                    <div className="venta-info">
                      <span className="venta-fecha">📅 {formatearFecha(venta.fecha)}</span>
                      <span className="venta-hora">🕐 {venta.hora}</span>
                      <span className={`venta-metodo ${venta.metodoPago}`}>
                        {venta.metodoPago === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
                      </span>
                    </div>
                    <div className="venta-productos">
                      {venta.productos.length} producto(s)
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de detalle de venta */}
      {ventaSeleccionada && (
        <div className="modal-overlay" onClick={() => setVentaSeleccionada(null)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🧾 Detalles de la Orden #{ventaSeleccionada.numeroOrden}</h2>
              <button onClick={() => setVentaSeleccionada(null)} className="btn-cerrar">✕</button>
            </div>

            <div className="modal-body">
              <div className="detalle-info">
                <div className="info-row">
                  <span className="info-label">Fecha:</span>
                  <span>{formatearFecha(ventaSeleccionada.fecha)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Hora:</span>
                  <span>{ventaSeleccionada.hora}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Método de pago:</span>
                  <span className={`metodo-badge ${ventaSeleccionada.metodoPago}`}>
                    {ventaSeleccionada.metodoPago === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
                  </span>
                </div>
                {ventaSeleccionada.metodoPago === 'efectivo' && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Monto recibido:</span>
                      <span>{formatearPrecio(ventaSeleccionada.montoRecibido)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Cambio:</span>
                      <span>{formatearPrecio(ventaSeleccionada.cambio)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="detalle-productos">
                <h3>Productos</h3>
                <div className="productos-detalle-lista">
                  {ventaSeleccionada.productos.map((prod, index) => (
                    <div key={index} className="producto-detalle-item">
                      <div className="producto-detalle-info">
                        <span className="producto-cantidad">{prod.cantidad}x</span>
                        <span className="producto-nombre">{prod.nombre}</span>
                      </div>
                      <span className="producto-precio">
                        {formatearPrecio(prod.precio * prod.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detalle-total">
                <span className="total-label">TOTAL</span>
                <span className="total-valor">{formatearPrecio(ventaSeleccionada.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}