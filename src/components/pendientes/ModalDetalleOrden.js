// src/components/pendientes/ModalDetalleOrden.js
import React from 'react';
import { calcularTiempoTranscurrido } from '../../utils/helpers';

const ModalDetalleOrden = ({
  ordenSeleccionada,
  cerrarDetalleOrden,
  modoAgregarProductos,
  iniciarAgregarProductos,
  procesarPagoPendiente,
  cancelarOrdenPendiente,
  categorias,
  categoriaActual,
  setCategoriaActual,
  productos,
  agregarProductoNuevo,
  productosNuevos,
  quitarProductoNuevo,
  confirmarProductosAgregados,
  setModoAgregarProductos,
  setProductosNuevos,
  verificarDisponibilidad,
  inventario
}) => {
  return (
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
                {productos[categoriaActual].map(producto => {
                  const disponible = verificarDisponibilidad(producto.id, 1, inventario);

                  return (
                    <div
                      key={producto.id}
                      className={`producto-mini ${!disponible ? 'producto-agotado' : ''}`}
                      onClick={() => disponible && agregarProductoNuevo(producto)}
                      style={{ 
                        cursor: disponible ? 'pointer' : 'not-allowed',
                        opacity: disponible ? 1 : 0.7
                      }}
                    >
                      <span>{producto.nombre}</span>
                      <span>${producto.precio.toLocaleString()}</span>
                      {!disponible && (
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>❌</span>
                      )}
                    </div>
                  );
                })}
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
  );
};

export default ModalDetalleOrden;