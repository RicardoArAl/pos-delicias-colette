import React, { useState, useEffect } from 'react';
import './App.css';

const ProductosMenu = {
  empanadas: [
    { id: 'e1', nombre: 'Arroz pollo', precio: 3000, descripcion: 'Empanada con arroz y pollo' },
    { id: 'e2', nombre: 'Arroz carne', precio: 3000, descripcion: 'Empanada con arroz y carne' },
    { id: 'e3', nombre: 'Papa carne', precio: 3000, descripcion: 'Empanada con papa y carne' },
    { id: 'e4', nombre: 'Pizza', precio: 3500, descripcion: 'Empanada con queso, tocineta y maiz' },
    { id: 'e5', nombre: 'Pollo champiñon', precio: 20000, descripcion: 'Empanada con champiñon y pollo' },
    { id: 'e6', nombre: 'Papa carne/pollo', precio: 20000, descripcion: 'Papa rellena de carne o pollo desmechado' }
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
    { id: 'pl1', nombre: 'Carne a la Plancha', precio: 23000, descripcion: 'Carne con porción de papas y ensalada' },
    { id: 'pl2', nombre: 'Pechuga a la Plancha', precio: 23000, descripcion: 'Pechuga con porción de papas y ensalada' },
    { id: 'pl3', nombre: 'Chorizo con Arepa', precio: 7500, descripcion: 'Chorizo con arepa' },
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

const obtenerVentas = () => {
  const ventasGuardadas = localStorage.getItem('ventas-delicias-colette');
  return ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
};

const guardarVenta = (venta) => {
  const ventas = obtenerVentas();
  ventas.push(venta);
  localStorage.setItem('ventas-delicias-colette', JSON.stringify(ventas));
  console.log('✅ Venta guardada:', venta);
};

const obtenerProximoNumeroOrden = () => {
  const ventas = obtenerVentas();
  if (ventas.length === 0) return 1000;
  const ultimaOrden = Math.max(...ventas.map(v => v.numeroOrden));
  return ultimaOrden + 1;
};

export default function App() {
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

  const categorias = [
    { id: 'empanadas', nombre: 'Empanadas', icon: '🥟' },
    { id: 'perros', nombre: 'Perros', icon: '🌭' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icon: '🍔' },
    { id: 'combos', nombre: 'Combos', icon: '🍽️' },
    { id: 'salchipapas', nombre: 'Salchipapas', icon: '🍟' },
    { id: 'platos', nombre: 'Platos', icon: '🍖' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' }
  ];

  useEffect(() => {
    const ventasGuardadas = obtenerVentas();
    setVentas(ventasGuardadas);
    setTotalVentas(ventasGuardadas.length);
  }, []);

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

  const confirmarPago = () => {
    if (metodoPago === 'efectivo') {
      const cambio = calcularCambio();
      if (cambio < 0) {
        alert('El monto recibido es menor al total');
        return;
      }
    }

    const nuevaOrden = obtenerProximoNumeroOrden();
    const ahora = new Date();
    const venta = {
      id: `venta-${Date.now()}`,
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

    guardarVenta(venta);
    const ventasActualizadas = obtenerVentas();
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
    }, 3000);
  };

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

    // Calcular productos más vendidos
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
                  onClick={() => agregarProducto(producto)}
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
              <h2>🛒 Pedido Actual</h2>
              <button
                onClick={limpiarPedido}
                className="btn-limpiar"
                disabled={pedido.length === 0}
              >
                🗑️ Limpiar
              </button>
            </div>
            <p className="pedido-count">{pedido.length} item(s)</p>
          </div>

          <div className="pedido-items">
            {pedido.length === 0 ? (
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
            )}
          </div>

          <div className="pedido-footer">
            <div className="total-container">
              <span className="total-label">TOTAL</span>
              <span className="total-valor">
                {formatearPrecio(calcularTotal())}
              </span>
            </div>
            
            <button
              disabled={pedido.length === 0}
              className="btn-pagar"
              onClick={abrirPantallaPago}
            >
              Ir a Pagar
            </button>
            
            <p className="fase-label">Fase 5: Reportes y Dashboard</p>
          </div>
        </div>

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
                        <label>Monto Recibido</label>
                        <input
                          type="number"
                          className="input-monto"
                          placeholder="Ingrese el monto"
                          value={montoRecibido}
                          onChange={(e) => setMontoRecibido(e.target.value)}
                        />
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

  if (vistaActual === 'reportes') {
    return (
      <div className="app-container reportes-view">
        <div className="reportes-container">
          <div className="reportes-header">
            <div className="reportes-header-top">
              <h1>📊 Reportes y Estadísticas</h1>
              <button 
                className="btn-volver"
                onClick={() => setVistaActual('pedidos')}
              >
                ← Volver a Pedidos
              </button>
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
                {/* Tarjetas de métricas principales */}
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

                {/* Desglose por método de pago */}
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

                {/* Top productos más vendidos */}
                <div className="seccion-reporte">
                  <h2>🏆 Top 5 Productos Más Vendidos</h2>
                  {estadisticas.topProductos.length === 0 ? (
                    <p className="texto-vacio-seccion">No hay datos de productos</p>
                  ) : (
                    <div className="top-productos-lista">
                      {estadisticas.topProductos.map((producto, index) => (
                        <div key={index} className="top-producto-item">
                          <div className="producto-ranking">#{index + 1}</div>
                          <div className="producto-info-top">
                            <span className="producto-nombre-top">{producto.nombre}</span>
                            <span className="producto-cantidad-top">{producto.cantidad} unidades</span>
                          </div>
                          <div className="producto-barra">
                            <div 
                              className="producto-barra-fill"
                              style={{
                                width: `${(producto.cantidad / estadisticas.topProductos[0].cantidad) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container historial-view">
      <div className="historial-container">
        <div className="historial-header">
          <div className="historial-header-top">
            <h1>📋 Historial de Ventas</h1>
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