import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import React, { useState, useEffect } from 'react';

// ========== IMPORTAR DATOS ==========
import { productos, categorias } from './data/productos';

// ========== IMPORTAR SERVICIOS FIREBASE ==========
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
import { 
  obtenerInventario, 
  actualizarStock, 
  descontarInventario,
  verificarDisponibilidad
} from './firebaseInventario';

// ========== IMPORTAR UTILIDADES ==========
import { calcularTotal, calcularCambio } from './utils/calculos';

// ========== IMPORTAR COMPONENTES ==========
import Header from './components/header';
import VistaPedidos from './components/pedidos/VistaPedidos';
import VistaPendientes from './components/pendientes/VistaPendientes';
import ModalDetalleOrden from './components/pendientes/ModalDetalleOrden';
import VistaHistorial from './components/historial/VistaHistorial';
import ModalDetalleVenta from './components/historial/ModalDetalleVenta';
import VistaReportes from './components/reportes/VistaReportes';
import VistaInventario from './components/inventario/VistaInventario';
import ModalInventario from './components/inventario/ModalInventario';
import ModalPago from './components/modales/ModalPago';
import ModalPIN from './components/modales/ModalPIN';
import ModalPrecio from './components/modales/ModalPrecio';
import ModalConfirmacion from './components/modales/ModalConfirmacion';

function App() {
  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [vistaActual, setVistaActual] = useState('pedidos');
  const [categoriaActual, setCategoriaActual] = useState('empanadas');
  const [pedido, setPedido] = useState([]);
  
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

  // Estados precio temporal
  const [mostrarModalPrecio, setMostrarModalPrecio] = useState(false);
  const [productoTemporal, setProductoTemporal] = useState(null);
  const [precioPersonalizado, setPrecioPersonalizado] = useState('');
  
  // Estados para inventario
  const [inventario, setInventario] = useState({});
  const [mostrarModalInventario, setMostrarModalInventario] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [nuevaCantidadStock, setNuevaCantidadStock] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  // ============================================
  // EFFECTS - CARGAR DATOS AL INICIO
  // ============================================
  useEffect(() => {
    const cargarVentas = async () => {
      const ventasFirebase = await obtenerVentasFirebase();
      setVentas(ventasFirebase);
    };
    cargarVentas();
  }, []);

  useEffect(() => {
    const cargarPendientes = async () => {
      const pendientes = await obtenerOrdenesPendientes();
      setOrdenesPendientes(pendientes);
    };
    cargarPendientes();
  }, []);

  useEffect(() => {
    if (!autenticado || !tiempoExpiracion) return;
    const verificarExpiracion = setInterval(() => {
      if (Date.now() >= tiempoExpiracion) {
        cerrarSesion();
      }
    }, 1000);
    return () => clearInterval(verificarExpiracion);
  }, [autenticado, tiempoExpiracion]);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    const inv = await obtenerInventario();
    setInventario(inv);
  };

  // ============================================
  // FUNCIONES DE MANEJO DE PEDIDOS
  // ============================================
  const agregarAlPedido = (producto) => {
    if (producto.precioVariable) {
      setProductoTemporal(producto);
      setPrecioPersonalizado('');
      setMostrarModalPrecio(true);
      return;
    }

    const disponible = verificarDisponibilidad(producto.id, 1, inventario);
    if (!disponible) {
      alert(`⚠️ No hay suficiente stock de ingredientes para: ${producto.nombre}`);
      return;
    }

    const productoExistente = pedido.find(item => item.id === producto.id);
    
    if (productoExistente) {
      const cantidadTotal = productoExistente.cantidad + 1;
      const disponibleCantidad = verificarDisponibilidad(producto.id, cantidadTotal, inventario);
      
      if (!disponibleCantidad) {
        alert(`⚠️ No hay suficiente stock para agregar más unidades de: ${producto.nombre}`);
        return;
      }
      
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

  const limpiarPedido = () => {
    setPedido([]);
    setMetodoPago('');
    setMontoRecibido('');
  };

  // ============================================
  // FUNCIONES DE PRECIO PERSONALIZADO
  // ============================================
  const cerrarModalPrecio = () => {
    setMostrarModalPrecio(false);
    setProductoTemporal(null);
    setPrecioPersonalizado('');
  };

  const agregarMontoPersonalizado = (monto) => {
    const montoActual = parseInt(precioPersonalizado || '0');
    const nuevoMonto = montoActual + monto;
    setPrecioPersonalizado(nuevoMonto.toString());
  };

  const confirmarPrecioPersonalizado = () => {
    const precio = parseInt(precioPersonalizado);
    
    if (!precio || precio < productoTemporal.precioMinimo) {
      alert(`El precio mínimo es $${productoTemporal.precioMinimo.toLocaleString()}`);
      return;
    }

    const idUnico = `${productoTemporal.id}-${precio}`;
    
    const productoConPrecio = {
      ...productoTemporal,
      id: idUnico,
      precio: precio,
      idOriginal: productoTemporal.id,
      nombre: `${productoTemporal.nombre} ($${precio.toLocaleString()})`
    };

    const productoExistente = pedido.find(item => item.id === idUnico);
    
    if (productoExistente) {
      setPedido(pedido.map(item =>
        item.id === idUnico
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setPedido([...pedido, { ...productoConPrecio, cantidad: 1 }]);
    }

    cerrarModalPrecio();
  };

  // ============================================
  // FUNCIONES DE ÓRDENES PENDIENTES
  // ============================================
  const guardarComoPendiente = async (clienteId = 'sin-cliente') => {
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
        clienteId: clienteId,
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
        total: calcularTotal(pedido),
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
  // FUNCIONES DE PAGO
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

  const confirmarPago = async () => {
    if (!metodoPago) {
      alert('Selecciona un método de pago');
      return;
    }

    if (metodoPago === 'efectivo') {
      const cambio = calcularCambio(montoRecibido, calcularTotal(pedido));
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
        cambio: metodoPago === 'efectivo' ? calcularCambio(montoRecibido, calcularTotal(pedido)) : null,
        total: calcularTotal(pedido)
      };

      await guardarVentaFirebase(venta);
      
      const productosParaDescontar = pagoDesdeOrdenPendiente 
        ? ordenSeleccionada.productos 
        : pedido;
    
      await descontarInventario(productosParaDescontar);
      await cargarInventario();

      if (pagoDesdeOrdenPendiente && ordenSeleccionada) {
        const ordenRef = doc(db, 'ordenes-pendientes', ordenSeleccionada.firebaseId);
        await updateDoc(ordenRef, {
          estado: 'completada',
          metodoPago: metodoPago,
          montoRecibido: metodoPago === 'efectivo' ? parseInt(montoRecibido) : null,
          cambio: metodoPago === 'efectivo' ? calcularCambio(montoRecibido, calcularTotal(pedido)) : null,
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
  // FUNCIONES DE HISTORIAL
  // ============================================
  const abrirDetalleVenta = (venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalleVenta(true);
  };

  const cerrarDetalleVenta = () => {
    setMostrarDetalleVenta(false);
    setVentaSeleccionada(null);
  };

  // ============================================
  // FUNCIONES DE INVENTARIO
  // ============================================
  const abrirModalInventario = (ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    setNuevaCantidadStock(ingrediente.stock.toString());
    setMostrarModalInventario(true);
  };

  const cerrarModalInventario = () => {
    setMostrarModalInventario(false);
    setIngredienteSeleccionado(null);
    setNuevaCantidadStock('');
  };

  const confirmarActualizacionStock = async () => {
    const cantidad = parseInt(nuevaCantidadStock);
  
    if (isNaN(cantidad) || cantidad < 0) {
      alert('Cantidad inválida');
      return;
    }
  
    const exito = await actualizarStock(
      ingredienteSeleccionado.id,
      cantidad,
      'Ajuste manual desde interfaz'
    );
  
    if (exito) {
      await cargarInventario();
      cerrarModalInventario();
    } else {
      alert('Error al actualizar stock');
    }
  };

  const agregarCantidadRapida = (monto) => {
    const cantidadActual = parseInt(nuevaCantidadStock || '0');
    setNuevaCantidadStock((cantidadActual + monto).toString());
  };

  // ============================================
  // SISTEMA DE PIN
  // ============================================
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
      setAutenticado(true);
      setTiempoExpiracion(Date.now() + TIEMPO_SESION_MS);
      cerrarModalPIN();
      
      if (vistaRequerida) {
        setVistaActual(vistaRequerida);
      }
    } else {
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
  // RENDER
  // ============================================
  return (
    <div className="App">
      <Header 
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        ordenesPendientes={ordenesPendientes}
        manejarClickVistaProtegida={manejarClickVistaProtegida}
        autenticado={autenticado}
        cerrarSesion={cerrarSesion}
      />

      {vistaActual === 'pedidos' && (
        <VistaPedidos
          categorias={categorias}
          categoriaActual={categoriaActual}
          setCategoriaActual={setCategoriaActual}
          productos={productos}
          agregarAlPedido={agregarAlPedido}
          verificarDisponibilidad={verificarDisponibilidad}
          inventario={inventario}
          pedido={pedido}
          quitarDelPedido={quitarDelPedido}
          eliminarDelPedido={eliminarDelPedido}
          calcularTotal={() => calcularTotal(pedido)}
          guardarComoPendiente={guardarComoPendiente}
          abrirPago={abrirPago}
        />
      )}

      {vistaActual === 'pendientes' && (
        <VistaPendientes
          ordenesPendientes={ordenesPendientes}
          abrirDetalleOrden={abrirDetalleOrden}
          procesarPagoPendiente={procesarPagoPendiente}
        />
      )}

      {vistaActual === 'historial' && (
        <VistaHistorial
          autenticado={autenticado}
          filtroHistorial={filtroHistorial}
          setFiltroHistorial={setFiltroHistorial}
          busquedaOrden={busquedaOrden}
          setBusquedaOrden={setBusquedaOrden}
          ventas={ventas}
          abrirDetalleVenta={abrirDetalleVenta}
        />
      )}

      {vistaActual === 'reportes' && (
        <VistaReportes
          filtroHistorial={filtroHistorial}
          setFiltroHistorial={setFiltroHistorial}
          ventas={ventas}
          autenticado={autenticado}
        />
      )}

      {vistaActual === 'inventario' && (
        <VistaInventario
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          inventario={inventario}
          abrirModalInventario={abrirModalInventario}
          cargarInventario={cargarInventario}
        />
      )}

      {/* MODALES */}
      {mostrarPago && (
        <ModalPago
          calcularTotal={() => calcularTotal(pedido)}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          agregarMonto={agregarMonto}
          montoRecibido={montoRecibido}
          setMontoRecibido={setMontoRecibido}
          calcularCambio={() => calcularCambio(montoRecibido, calcularTotal(pedido))}
          cerrarPago={cerrarPago}
          confirmarPago={confirmarPago}
        />
      )}

      {mostrarDetalleOrden && ordenSeleccionada && (
        <ModalDetalleOrden
          ordenSeleccionada={ordenSeleccionada}
          cerrarDetalleOrden={cerrarDetalleOrden}
          modoAgregarProductos={modoAgregarProductos}
          iniciarAgregarProductos={iniciarAgregarProductos}
          procesarPagoPendiente={procesarPagoPendiente}
          cancelarOrdenPendiente={cancelarOrdenPendiente}
          categorias={categorias}
          categoriaActual={categoriaActual}
          setCategoriaActual={setCategoriaActual}
          productos={productos}
          agregarProductoNuevo={agregarProductoNuevo}
          productosNuevos={productosNuevos}
          quitarProductoNuevo={quitarProductoNuevo}
          confirmarProductosAgregados={confirmarProductosAgregados}
          setModoAgregarProductos={setModoAgregarProductos}
          setProductosNuevos={setProductosNuevos}
          verificarDisponibilidad={verificarDisponibilidad}
          inventario={inventario}
        />
      )}

      {mostrarDetalleVenta && ventaSeleccionada && (
        <ModalDetalleVenta
          ventaSeleccionada={ventaSeleccionada}
          cerrarDetalleVenta={cerrarDetalleVenta}
        />
      )}

      {mostrarConfirmacion && <ModalConfirmacion />}

      {mostrarModalPIN && (
        <ModalPIN
          pinIngresado={pinIngresado}
          errorPIN={errorPIN}
          agregarDigitoPIN={agregarDigitoPIN}
          borrarDigitoPIN={borrarDigitoPIN}
          confirmarPIN={confirmarPIN}
          cerrarModalPIN={cerrarModalPIN}
        />
      )}

      {mostrarModalPrecio && productoTemporal && (
        <ModalPrecio
          productoTemporal={productoTemporal}
          precioPersonalizado={precioPersonalizado}
          setPrecioPersonalizado={setPrecioPersonalizado}
          agregarMontoPersonalizado={agregarMontoPersonalizado}
          confirmarPrecioPersonalizado={confirmarPrecioPersonalizado}
          cerrarModalPrecio={cerrarModalPrecio}
        />
      )}

      {mostrarModalInventario && ingredienteSeleccionado && (
        <ModalInventario
          ingredienteSeleccionado={ingredienteSeleccionado}
          cerrarModalInventario={cerrarModalInventario}
          nuevaCantidadStock={nuevaCantidadStock}
          setNuevaCantidadStock={setNuevaCantidadStock}
          agregarCantidadRapida={agregarCantidadRapida}
          confirmarActualizacionStock={confirmarActualizacionStock}
/>
)}
</div>
);
}export default App;