import React, { useState, useEffect } from 'react';
import './App.css';

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

// Funciones de localStorage
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
  const [categoriaActiva, setCategoriaActiva] = useState('empanadas');
  const [pedido, setPedido] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);

  const categorias = [
    { id: 'empanadas', nombre: 'Empanadas', icon: '🥟' },
    { id: 'perros', nombre: 'Perros', icon: '🌭' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icon: '🍔' },
    { id: 'combos', nombre: 'Combos', icon: '🍽️' },
    { id: 'salchipapas', nombre: 'Salchipapas', icon: '🍟' },
    { id: 'platos', nombre: 'Platos', icon: '🍖' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' }
  ];

  // Cargar total de ventas al iniciar
  useEffect(() => {
    const ventas = obtenerVentas();
    setTotalVentas(ventas.length);
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
    // Validar según método de pago
    if (metodoPago === 'efectivo') {
      const cambio = calcularCambio();
      if (cambio < 0) {
        alert('El monto recibido es menor al total');
        return;
      }
    }

    // Obtener siguiente número de orden
    const nuevaOrden = obtenerProximoNumeroOrden();
    
    // Crear objeto de venta
    const ahora = new Date();
    const venta = {
      id: `venta-${Date.now()}`,
      numeroOrden: nuevaOrden,
      fecha: ahora.toISOString().split('T')[0], // YYYY-MM-DD
      hora: ahora.toTimeString().split(' ')[0], // HH:MM:SS
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

    // Guardar en localStorage
    guardarVenta(venta);

    // Actualizar contador de ventas
    setTotalVentas(totalVentas + 1);

    // Mostrar éxito
    setNumeroOrden(nuevaOrden);
    setPagoExitoso(true);

    // Después de 3 segundos, cerrar todo y limpiar
    setTimeout(() => {
      setPagoExitoso(false);
      setMostrarPago(false);
      setPedido([]);
      setMetodoPago('');
      setMontoRecibido('');
      setNumeroOrden(null);
    }, 3000);
  };

  return (
    <div className="app-container">
      {/* Panel Principal - Productos */}
      <div className="main-panel">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div>
              <h1>🍔 Delicias de Colette</h1>
              <p className="subtitle">Sistema POS - Toma de Pedidos</p>
            </div>
            <div className="stats-badge">
              <span className="stats-label">Ventas del sistema:</span>
              <span className="stats-number">{totalVentas}</span>
            </div>
          </div>
        </div>

        {/* Categorías */}
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

        {/* Productos */}
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

      {/* Panel Lateral - Pedido */}
      <div className="pedido-panel">
        {/* Header del Pedido */}
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

        {/* Lista de Items */}
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

        {/* Total y Acciones */}
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
          
          <p className="fase-label">Fase 3: Almacenamiento Local</p>
        </div>
      </div>

      {/* Modal de Pago */}
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
                  {/* Resumen del Pedido */}
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

                  {/* Método de Pago */}
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

                  {/* Campo de Efectivo */}
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