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
  obtenerProximoNumeroOrdenTotal
} from './firebasePendientes';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { verificarPINSeguro, TIEMPO_SESION_MS } from './pinConfig';

// ============================================
// DATOS DE PRODUCTOS
// ============================================

function App() {

  const productos = {
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
  // Todas las categorías disponibles
  const categorias = [
    { id: 'empanadas', nombre: 'Empanadas', icono: '🥟' },
    { id: 'perros', nombre: 'Perros', icono: '🌭' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔' },
    { id: 'combos', nombre: 'Combos', icono: '🎁' },
    { id: 'salchipapas', nombre: 'Salchipapas', icono: '🍟' },
    { id: 'platos', nombre: 'Platos', icono: '🍽️' },
    { id: 'bebidas', nombre: 'Bebidas', icono: '🥤' }
  ];

  // ============================================
  //ESTADOS DE REACT
// ============================================

  // Estados principales del sistema
  const [vistaActual, setVistaActual] = useState('pedidos'); // 'pedidos' | 'historial' | 'reportes' | 'pendientes'
  const [categoriaActual, setCategoriaActual] = useState('empanadas');
  const [pedido, setPedido] = useState([]); // Carrito de compras actual
  
  // Estados de órdenes pendientes
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarDetalleOrden, setMostrarDetalleOrden] = useState(false);
  const [modoAgregarProductos, setModoAgregarProductos] = useState(false);
  const [productosNuevos, setProductosNuevos] = useState([]);
  
  // Estados de pago
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pagoDesdeOrdenPendiente, setPagoDesdeOrdenPendiente] = useState(false);
  
  // Estados de historial y reportes
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarDetalleVenta, setMostrarDetalleVenta] = useState(false);
  const [filtroHistorial, setFiltroHistorial] = useState('hoy');
  const [busquedaOrden, setBusquedaOrden] = useState('');
  
  // Estados del sistema de PIN
  const [mostrarModalPIN, setMostrarModalPIN] = useState(false);
  const [pinIngresado, setPinIngresado] = useState('');
  const [errorPIN, setErrorPIN] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [tiempoExpiracion, setTiempoExpiracion] = useState(null);
  const [vistaRequerida, setVistaRequerida] = useState('');

  // ============================================
 //useEffect Y FUNCIONES DE FIREBASE
// ============================================

  // Cargar ventas desde Firebase al iniciar
  useEffect(() => {
    const cargarVentas = async () => {
      const ventasFirebase = await obtenerVentasFirebase();
      setVentas(ventasFirebase);
    };
    cargarVentas();
  }, []);

  // Cargar órdenes pendientes al iniciar
  useEffect(() => {
    const cargarPendientes = async () => {
      const pendientes = await obtenerOrdenesPendientes();
      setOrdenesPendientes(pendientes);
    };
    cargarPendientes();
  }, []);

  // Verificar expiración de sesión del PIN
  useEffect(() => {
    if (!autenticado || !tiempoExpiracion) return;

    const verificarExpiracion = setInterval(() => {
      if (Date.now() >= tiempoExpiracion) {
        cerrarSesion();
      }
    }, 1000);

    return () => clearInterval(verificarExpiracion);
  }, [autenticado, tiempoExpiracion]);

  // ============================================
  // FUNCIONES DE MANEJO DE PEDIDOS
  // ============================================

  const agregarAlPedido = (producto) => {
    const existente = pedido.find(item => item.id === producto.id);
    
    if (existente) {
      setPedido(pedido.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelPedido = (productoId) => {
    const producto = pedido.find(item => item.id === productoId);
    
    if (producto.cantidad > 1) {
      setPedido(pedido.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      setPedido(pedido.filter(item => item.id !== productoId));
    }
  };

  const eliminarDelPedido = (productoId) => {
    setPedido(pedido.filter(item => item.id !== productoId));
  };

  const calcularTotal = () => {
    return pedido.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const limpiarPedido = () => {
    setPedido([]);
    setMetodoPago('');
    setMontoRecibido('');
  };

  // ============================================
  // FUNCIONES DE ÓRDENES PENDIENTES
  // ============================================

  const guardarComoPendiente = async () => {
    if (pedido.length === 0) {
      alert('El pedido está vacío');
      return;
    }

    try {
      const proximoNumero = await obtenerProximoNumeroOrdenTotal(ventas, ordenesPendientes);
      const ahora = new Date();
      
      const nuevaOrden = {
        numeroOrden: proximoNumero,
        estado: 'pendiente',
        fecha: ahora.toISOString().split('T')[0],
        hora: ahora.toTimeString().split(' ')[0],
        fechaCreacion: Timestamp.now(),
        ultimaActualizacion: Timestamp.now(),
        productos: pedido.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad
        })),
        total: calcularTotal(),
        cantidadProductos: pedido.reduce((sum, item) => sum + item.cantidad, 0),
        metodoPago: null,
        montoRecibido: null,
        cambio: null,
        fechaPago: null,
        horaPago: null
      };

      const firebaseId = await guardarOrdenPendiente(nuevaOrden);
      nuevaOrden.firebaseId = firebaseId;

      setOrdenesPendientes([...ordenesPendientes, nuevaOrden]);
      limpiarPedido();
      alert(`Orden #${proximoNumero} guardada como pendiente`);
      
    } catch (error) {
      console.error('Error al guardar orden pendiente:', error);
      alert('Error al guardar la orden pendiente');
    }
  };

  const abrirDetalleOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarDetalleOrden(true);
  };

  const cerrarDetalleOrden = () => {
    setMostrarDetalleOrden(false);
    setOrdenSeleccionada(null);
    setModoAgregarProductos(false);
    setProductosNuevos([]);
  };

  const iniciarAgregarProductos = () => {
    setModoAgregarProductos(true);
    setProductosNuevos([]);
  };

  const agregarProductoNuevo = (producto) => {
    const existente = productosNuevos.find(item => item.id === producto.id);
    
    if (existente) {
      setProductosNuevos(productosNuevos.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setProductosNuevos([...productosNuevos, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProductoNuevo = (productoId) => {
    const producto = productosNuevos.find(item => item.id === productoId);
    
    if (producto.cantidad > 1) {
      setProductosNuevos(productosNuevos.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      setProductosNuevos(productosNuevos.filter(item => item.id !== productoId));
    }
  };

  const confirmarProductosAgregados = async () => {
    if (productosNuevos.length === 0) {
      alert('No hay productos nuevos para agregar');
      return;
    }

    try {
      const productosActualizados = [
        ...(ordenSeleccionada.productos || []),
        ...productosNuevos
      ];

      const nuevoTotal = productosActualizados.reduce(
        (sum, item) => sum + (item.precio * item.cantidad), 
        0
      );

      const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
      await updateDoc(ordenRef, {
        productos: productosActualizados,
        total: nuevoTotal,
        cantidadProductos: productosActualizados.reduce((sum, item) => sum + item.cantidad, 0),
        ultimaActualizacion: Timestamp.now()
      });

      const ordenActualizada = {
        ...ordenSeleccionada,
        productos: productosActualizados,
        total: nuevoTotal,
        cantidadProductos: productosActualizados.reduce((sum, item) => sum + item.cantidad, 0)
      };

      setOrdenesPendientes(ordenesPendientes.map(o =>
        o.firebaseId === ordenSeleccionada.firebaseId ? ordenActualizada : o
      ));

      setOrdenSeleccionada(ordenActualizada);
      setModoAgregarProductos(false);
      setProductosNuevos([]);
      alert('Productos agregados exitosamente');

    } catch (error) {
      console.error('Error al agregar productos:', error);
      alert('Error al agregar productos a la orden');
    }
  };

  const procesarPagoPendiente = (orden) => {
    if (!orden || !orden.productos || orden.productos.length === 0) {
      alert('Error: La orden no tiene productos válidos');
      return;
    }

    setPedido(orden.productos.map(item => ({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      categoria: item.categoria || 'sin-categoria'
    })));

    setOrdenSeleccionada(orden);
    setPagoDesdeOrdenPendiente(true);
    setMostrarPago(true);
    setMostrarDetalleOrden(false);
  };

  const cancelarOrdenPendiente = async () => {
    if (!window.confirm(`¿Estás seguro de cancelar la orden #${ordenSeleccionada.numeroOrden}?`)) {
      return;
    }

    try {
      const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
      await updateDoc(ordenRef, {
        estado: 'cancelada',
        ultimaActualizacion: Timestamp.now()
      });

      setOrdenesPendientes(ordenesPendientes.filter(o => 
        o.firebaseId !== ordenSeleccionada.firebaseId
      ));

      cerrarDetalleOrden();
      alert('Orden cancelada exitosamente');

    } catch (error) {
      console.error('Error al cancelar orden:', error);
      alert('Error al cancelar la orden');
    }
  };

  // ============================================
// FUNCIONES DE PAGO Y HISTORIAL
// ============================================

  const abrirPago = () => {
    if (pedido.length === 0) {
      alert('El pedido está vacío');
      return;
    }
    setPagoDesdeOrdenPendiente(false);
    setMostrarPago(true);
  };

  const cerrarPago = () => {
    setMostrarPago(false);
    setMetodoPago('');
    setMontoRecibido('');
    if (!pagoDesdeOrdenPendiente) {
      setPedido([]);
    }
    setPagoDesdeOrdenPendiente(false);
    setOrdenSeleccionada(null);
  };

  const agregarMonto = (monto) => {
    setMontoRecibido(prev => {
      const nuevoMonto = (parseInt(prev) || 0) + monto;
      return nuevoMonto.toString();
    });
  };

  const calcularCambio = () => {
    const total = calcularTotal();
    const recibido = parseInt(montoRecibido) || 0;
    return recibido - total;
  };

  const confirmarPago = async () => {
    if (!metodoPago) {
      alert('Selecciona un método de pago');
      return;
    }

    if (metodoPago === 'efectivo') {
      const cambio = calcularCambio();
      if (cambio < 0) {
        alert('El monto recibido es insuficiente');
        return;
      }
    }

    try {
      const ahora = new Date();
      let numeroOrden;

      if (pagoDesdeOrdenPendiente && ordenSeleccionada) {
        numeroOrden = ordenSeleccionada.numeroOrden;
      } else {
        numeroOrden = await obtenerProximoNumeroOrdenTotal(ventas, ordenesPendientes);
      }

      const venta = {
        numeroOrden: numeroOrden,
        fecha: ahora.toISOString().split('T')[0],
        hora: ahora.toTimeString().split(' ')[0],
        productos: pedido,
        metodoPago: metodoPago,
        montoRecibido: metodoPago === 'efectivo' ? parseInt(montoRecibido) : null,
        cambio: metodoPago === 'efectivo' ? calcularCambio() : null,
        total: calcularTotal()
      };

      await guardarVentaFirebase(venta);

      if (pagoDesdeOrdenPendiente && ordenSeleccionada) {
        const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
        await updateDoc(ordenRef, {
          estado: 'completada',
          metodoPago: metodoPago,
          montoRecibido: metodoPago === 'efectivo' ? parseInt(montoRecibido) : null,
          cambio: metodoPago === 'efectivo' ? calcularCambio() : null,
          fechaPago: venta.fecha,
          horaPago: venta.hora,
          ultimaActualizacion: Timestamp.now()
        });

        setOrdenesPendientes(ordenesPendientes.filter(o => 
          o.firebaseId !== ordenSeleccionada.firebaseId
        ));
      }

      setVentas([...ventas, venta]);
      setMostrarPago(false);
      setMostrarConfirmacion(true);

      setTimeout(() => {
        setMostrarConfirmacion(false);
        limpiarPedido();
        setPagoDesdeOrdenPendiente(false);
        setOrdenSeleccionada(null);
      }, 2000);

    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago');
    }
  };

  // ============================================
  // FUNCIONES DE HISTORIAL Y REPORTES
  // ============================================

  const obtenerVentasFiltradas = () => {
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

  const abrirDetalleVenta = (venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalleVenta(true);
  };

  const cerrarDetalleVenta = () => {
    setMostrarDetalleVenta(false);
    setVentaSeleccionada(null);
  };

  const calcularEstadisticas = () => {
    const ventasFiltradas = obtenerVentasFiltradas();
    
    const totalVendido = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
    const numeroOrdenes = ventasFiltradas.length;
    const promedioVenta = numeroOrdenes > 0 ? totalVendido / numeroOrdenes : 0;
    
    const porEfectivo = ventasFiltradas
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + v.total, 0);
    
    const porTransferencia = ventasFiltradas
      .filter(v => v.metodoPago === 'transferencia')
      .reduce((sum, v) => sum + v.total, 0);

    return {
      totalVendido,
      numeroOrdenes,
      promedioVenta,
      porEfectivo,
      porTransferencia
    };
  };

  const exportarCSV = () => {
    const ventasFiltradas = obtenerVentasFiltradas();
    
    if (ventasFiltradas.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }

    let csv = 'Orden,Fecha,Hora,Productos,Método Pago,Total\n';
    
    ventasFiltradas.forEach(venta => {
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

  const calcularTiempoTranscurrido = (fechaCreacion) => {
    if (!fechaCreacion || !fechaCreacion.toDate) return 0;
    
    const ahora = new Date();
    const creacion = fechaCreacion.toDate();
    const diferencia = ahora - creacion;
    return Math.floor(diferencia / (1000 * 60)); // minutos
  };

  const obtenerColorTiempo = (minutos) => {
    if (minutos < 30) return '#16a34a'; // verde
    if (minutos < 60) return '#f59e0b'; // amarillo
    return '#dc2626'; // rojo
  };

  // ============================================
// SISTEMA DE PIN Y COMPONENTE MODAL
// ============================================

  // FUNCIONES DE MANEJO DE PIN
  
  const abrirModalPIN = (vista) => {
    setVistaRequerida(vista);
    setMostrarModalPIN(true);
    setPinIngresado('');
    setErrorPIN('');
  };

  const cerrarModalPIN = () => {
    setMostrarModalPIN(false);
    setPinIngresado('');
    setErrorPIN('');
    setVistaRequerida('');
  };

  const agregarDigitoPIN = (digito) => {
    if (pinIngresado.length < 4) {
      setPinIngresado(prev => prev + digito);
      setErrorPIN('');
    }
  };

  const borrarDigitoPIN = () => {
    setPinIngresado(prev => prev.slice(0, -1));
    setErrorPIN('');
  };

  const confirmarPIN = () => {
    if (pinIngresado.length !== 4) {
      setErrorPIN('Ingresa los 4 dígitos del PIN');
      return;
    }

    if (verificarPINSeguro(pinIngresado)) {
      // PIN correcto
      setAutenticado(true);
      setTiempoExpiracion(Date.now() + TIEMPO_SESION_MS);
      cerrarModalPIN();
      
      // Cambiar a la vista solicitada
      if (vistaRequerida) {
        setVistaActual(vistaRequerida);
      }
    } else {
      // PIN incorrecto
      setErrorPIN('PIN incorrecto. Intenta nuevamente.');
      setPinIngresado('');
    }
  };

  const cerrarSesion = () => {
    setAutenticado(false);
    setTiempoExpiracion(null);
    setVistaActual('pedidos');
  };

  const manejarClickVistaProtegida = (vista) => {
    if (autenticado) {
      setVistaActual(vista);
    } else {
      abrirModalPIN(vista);
    }
  };

  // ============================================
  // COMPONENTE MODAL DE PIN
  // ============================================

  const ModalPIN = () => {
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    return (
      <div className="modal-pin-overlay" onClick={cerrarModalPIN}>
        <div className="modal-pin-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-pin-header">
            <h2>🔐 Acceso Restringido</h2>
            <p>Ingresa el PIN de 4 dígitos</p>
          </div>

          <div className="pin-display">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-circle ${pinIngresado.length > i ? 'filled' : ''}`}
              />
            ))}
          </div>

          <div className="pin-teclado">
            {numeros.map((num) => (
              <button
                key={num}
                className="pin-boton"
                onClick={() => agregarDigitoPIN(num.toString())}
              >
                {num}
              </button>
            ))}
            
            <button
              className="pin-boton borrar"
              onClick={borrarDigitoPIN}
              disabled={pinIngresado.length === 0}
            >
              ⌫
            </button>
            
            <button
              className="pin-boton"
              onClick={() => agregarDigitoPIN('0')}
            >
              0
            </button>
            
            <button
              className="pin-boton especial"
              onClick={confirmarPIN}
              disabled={pinIngresado.length !== 4}
            >
              ✓
            </button>
          </div>

          {errorPIN && (
            <div className="pin-error">{errorPIN}</div>
          )}

          <button className="pin-boton-cancelar" onClick={cerrarModalPIN}>
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  // ============================================
// RENDER JSX COMPLETO
// ============================================

  return (
    <div className="App">
      {/* HEADER */}
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

      {/* VISTA DE PEDIDOS */}
      {vistaActual === 'pedidos' && (
        <div className="contenedor-principal">
          <div className="panel-productos">
            {/* Categorías */}
            <div className="categorias">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  className={categoriaActual === cat.id ? 'activo' : ''}
                  onClick={() => setCategoriaActual(cat.id)}
                >
                  {cat.icono} {cat.nombre}
                </button>
              ))}
            </div>

            {/* Grid de productos */}
            <div className="grid-productos">
              {productos[categoriaActual].map(producto => (
                <div
                  key={producto.id}
                  className="tarjeta-producto"
                  onClick={() => agregarAlPedido(producto)}
                >
                  <h3>{producto.nombre}</h3>
                  <p className="precio">${producto.precio.toLocaleString()}</p>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Panel de pedido */}
          <div className="panel-pedido">
            <h2>🛒 Pedido Actual</h2>
            
            {pedido.length === 0 ? (
              <div className="pedido-vacio">
                <p>🍽️ No hay productos en el pedido</p>
              </div>
            ) : (
              <>
                <div className="lista-pedido">
                  {pedido.map(item => (
                    <div key={item.id} className="item-pedido">
                      <div className="item-info">
                        <h4>{item.nombre}</h4>
                        <p className="item-precio">${(item.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                      <div className="item-controles">
                        <button onClick={() => quitarDelPedido(item.id)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => agregarAlPedido(item)}>+</button>
                        <button 
                          className="boton-eliminar"
                          onClick={() => eliminarDelPedido(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total-pedido">
                  <h3>Total: ${calcularTotal().toLocaleString()}</h3>
                </div>

                <div className="acciones-pedido">
                  <button 
                    className="boton-pendiente"
                    onClick={guardarComoPendiente}
                  >
                    ⏳ Guardar como Pendiente
                  </button>
                  <button 
                    className="boton-pagar"
                    onClick={abrirPago}
                  >
                    💰 Pagar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* VISTA DE ÓRDENES PENDIENTES */}
      {vistaActual === 'pendientes' && (
        <div className="vista-pendientes">
          <div className="header-pendientes">
            <h2>⏳ Órdenes Pendientes ({ordenesPendientes.length})</h2>
          </div>

          {ordenesPendientes.length === 0 ? (
            <div className="sin-pendientes">
              <p>✅ No hay órdenes pendientes</p>
            </div>
          ) : (
            <div className="grid-pendientes">
              {ordenesPendientes.map(orden => {
                const minutos = calcularTiempoTranscurrido(orden.fechaCreacion);
                const colorTiempo = obtenerColorTiempo(minutos);
                
                return (
                  <div 
                    key={orden.firebaseId} 
                    className="tarjeta-orden-pendiente"
                    style={{ borderLeft: `4px solid ${colorTiempo}` }}
                  >
                    <div className="orden-header">
                      <h3>Orden #{orden.numeroOrden}</h3>
                      <span 
                        className="tiempo-transcurrido"
                        style={{ background: colorTiempo }}
                      >
                        {minutos} min
                      </span>
                    </div>
                    
                    <div className="orden-info">
                      <p>📅 {orden.fecha} - {orden.hora}</p>
                      <p>🛒 {orden.cantidadProductos} productos</p>
                      <p className="orden-total">💰 ${orden.total.toLocaleString()}</p>
                    </div>

                    <div className="orden-acciones">
                      <button onClick={() => abrirDetalleOrden(orden)}>
                        👁️ Ver Detalles
                      </button>
                      <button 
                        className="boton-pagar-pendiente"
                        onClick={() => procesarPagoPendiente(orden)}
                      >
                        💳 Pagar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VISTA DE HISTORIAL */}
      {vistaActual === 'historial' && (
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

            <button className="boton-exportar" onClick={exportarCSV}>
              📥 Exportar CSV
            </button>
          </div>

          <div className="lista-ventas">
            {obtenerVentasFiltradas().length === 0 ? (
              <div className="sin-ventas">
                <p>No hay ventas para mostrar</p>
              </div>
            ) : (
              obtenerVentasFiltradas().map(venta => (
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
      )}

      {/* VISTA DE REPORTES */}
      {vistaActual === 'reportes' && (
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
              <p className="valor-grande">${calcularEstadisticas().totalVendido.toLocaleString()}</p>
            </div>

            <div className="tarjeta-estadistica">
              <h3>🛒 Número de Órdenes</h3>
              <p className="valor-grande">{calcularEstadisticas().numeroOrdenes}</p>
            </div>

            <div className="tarjeta-estadistica">
              <h3>📊 Promedio por Venta</h3>
              <p className="valor-grande">${Math.round(calcularEstadisticas().promedioVenta).toLocaleString()}</p>
            </div>

            <div className="tarjeta-estadistica">
              <h3>💵 Efectivo</h3>
              <p className="valor-grande">${calcularEstadisticas().porEfectivo.toLocaleString()}</p>
            </div>

            <div className="tarjeta-estadistica">
              <h3>💳 Transferencia</h3>
              <p className="valor-grande">${calcularEstadisticas().porTransferencia.toLocaleString()}</p>
            </div>
          </div>

          <button className="boton-exportar-reportes" onClick={exportarCSV}>
            📥 Exportar Reporte CSV
          </button>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {mostrarPago && (
        <div className="modal-overlay" onClick={cerrarPago}>
          <div className="modal-pago" onClick={(e) => e.stopPropagation()}>
            <h2>💰 Procesar Pago</h2>
            
            <div className="total-modal">
              <h3>Total a pagar: ${calcularTotal().toLocaleString()}</h3>
            </div>

            <div className="metodos-pago">
              <button
                className={metodoPago === 'efectivo' ? 'activo' : ''}
                onClick={() => setMetodoPago('efectivo')}
              >
                💵 Efectivo
              </button>
              <button
                className={metodoPago === 'transferencia' ? 'activo' : ''}
                onClick={() => setMetodoPago('transferencia')}
              >
                💳 Transferencia
              </button>
            </div>

            {metodoPago === 'efectivo' && (
              <>
                <div className="selector-billetes">
                  <h4>Monto recibido:</h4>
                  <div className="grid-billetes">
                    <button onClick={() => agregarMonto(2000)}>$2.000</button>
                    <button onClick={() => agregarMonto(5000)}>$5.000</button>
                    <button onClick={() => agregarMonto(10000)}>$10.000</button>
                    <button onClick={() => agregarMonto(20000)}>$20.000</button>
                    <button onClick={() => agregarMonto(50000)}>$50.000</button>
                    <button onClick={() => agregarMonto(100000)}>$100.000</button>
                  </div>
                </div>

                <div className="monto-recibido">
                  <h4>Monto ingresado:</h4>
                  <input
                    type="text"
                    value={montoRecibido ? `$${parseInt(montoRecibido).toLocaleString()}` : '$0'}
                    readOnly
                  />
                  <button 
                    className="boton-limpiar"
                    onClick={() => setMontoRecibido('')}
                  >
                    🗑️ Limpiar
                  </button>
                </div>

                {montoRecibido && (
                  <div className="cambio-display">
                    <h4>Cambio:</h4>
                    <p className={calcularCambio() < 0 ? 'cambio-negativo' : 'cambio-positivo'}>
                      ${calcularCambio().toLocaleString()}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="acciones-modal">
              <button className="boton-cancelar" onClick={cerrarPago}>
                ❌ Cancelar
              </button>
              <button 
                className="boton-confirmar"
                onClick={confirmarPago}
                disabled={!metodoPago || (metodoPago === 'efectivo' && calcularCambio() < 0)}
              >
                ✅ Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE ORDEN PENDIENTE */}
      {mostrarDetalleOrden && ordenSeleccionada && (
        <div className="modal-overlay" onClick={cerrarDetalleOrden}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <h2>📋 Detalle Orden #{ordenSeleccionada.numeroOrden}</h2>
            
            <div className="info-orden">
              <p><strong>Estado:</strong> {ordenSeleccionada.estado}</p>
              <p><strong>Fecha:</strong> {ordenSeleccionada.fecha} - {ordenSeleccionada.hora}</p>
              <p><strong>Tiempo transcurrido:</strong> {calcularTiempoTranscurrido(ordenSeleccionada.fechaCreacion)} minutos</p>
            </div>

            {!modoAgregarProductos ? (
              <>
                <div className="productos-orden">
                  <h3>Productos:</h3>
                  {ordenSeleccionada.productos && ordenSeleccionada.productos.length > 0 ? (
                    ordenSeleccionada.productos.map((prod, index) => (
                      <div key={index} className="producto-detalle">
                        <span>{prod.nombre} x{prod.cantidad}</span>
                        <span>${(prod.precio * prod.cantidad).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p>No hay productos en esta orden</p>
                  )}
                </div>

                <div className="total-orden-detalle">
                  <h3>Total: ${ordenSeleccionada.total.toLocaleString()}</h3>
                </div>

                <div className="acciones-detalle">
                  <button onClick={iniciarAgregarProductos}>
                    ➕ Agregar Productos
                  </button>
                  <button 
                    className="boton-pagar"
                    onClick={() => procesarPagoPendiente(ordenSeleccionada)}
                  >
                    💳 Procesar Pago
                  </button>
                  <button 
                    className="boton-cancelar-orden"
                    onClick={cancelarOrdenPendiente}
                  >
                    🗑️ Cancelar Orden
                  </button>
                  <button onClick={cerrarDetalleOrden}>
                    ❌ Cerrar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="agregar-productos-modo">
                  <h3>Agregar nuevos productos</h3>
                  
                  <div className="categorias-mini">
                    {categorias.map(cat => (
                      <button
                        key={cat.id}
                        className={categoriaActual === cat.id ? 'activo' : ''}
                        onClick={() => setCategoriaActual(cat.id)}
                      >
                        {cat.icono}
                      </button>
                    ))}
                  </div>

                  <div className="grid-productos-mini">
                    {productos[categoriaActual].map(producto => (
                      <div
                        key={producto.id}
                        className="producto-mini"
                        onClick={() => agregarProductoNuevo(producto)}
                      >
                        <span>{producto.nombre}</span>
                        <span>${producto.precio.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {productosNuevos.length > 0 && (
                    <div className="productos-nuevos-lista">
                      <h4>Productos a agregar:</h4>
                      {productosNuevos.map(item => (
                        <div key={item.id} className="producto-nuevo-item">
                          <span>{item.nombre} x{item.cantidad}</span>
                          <div>
                            <button onClick={() => quitarProductoNuevo(item.id)}>-</button>
                            <button onClick={() => agregarProductoNuevo(item)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="acciones-agregar">
                    <button 
                      className="boton-confirmar"
                      onClick={confirmarProductosAgregados}
                      disabled={productosNuevos.length === 0}
                    >
                      ✅ Confirmar Productos
                    </button>
                    <button 
                      className="boton-cancelar"
                      onClick={() => {
                        setModoAgregarProductos(false);
                        setProductosNuevos([]);
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE VENTA */}
      {mostrarDetalleVenta && ventaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarDetalleVenta}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <h2>🧾 Detalle Venta #{ventaSeleccionada.numeroOrden}</h2>
            
            <div className="info-venta">
              <p><strong>Fecha:</strong> {ventaSeleccionada.fecha}</p>
              <p><strong>Hora:</strong> {ventaSeleccionada.hora}</p>
              <p><strong>Método de pago:</strong> {ventaSeleccionada.metodoPago}</p>
              {ventaSeleccionada.metodoPago === 'efectivo' && (
                <>
                  <p><strong>Monto recibido:</strong> ${ventaSeleccionada.montoRecibido?.toLocaleString()}</p>
                  <p><strong>Cambio:</strong> ${ventaSeleccionada.cambio?.toLocaleString()}</p>
                </>
              )}
            </div>

            <div className="productos-venta">
              <h3>Productos:</h3>
              {ventaSeleccionada.productos.map((prod, index) => (
                <div key={index} className="producto-detalle">
                  <span>{prod.nombre} x{prod.cantidad}</span>
                  <span>${(prod.precio * prod.cantidad).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="total-venta-detalle">
              <h3>Total: ${ventaSeleccionada.total.toLocaleString()}</h3>
            </div>

            <button className="boton-cerrar" onClick={cerrarDetalleVenta}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="modal-confirmacion">
          <div className="confirmacion-contenido">
            <div className="icono-exito">✅</div>
            <h2>¡Pago Exitoso!</h2>
            <p>La orden ha sido procesada correctamente</p>
          </div>
        </div>
      )}

      {/* MODAL DE PIN */}
      {mostrarModalPIN && <ModalPIN />}
    </div>
  );
}

export default App;