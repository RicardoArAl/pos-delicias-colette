// src/components/pendientes/ModalDetalleOrden.js
import React from 'react';
import { calcularTiempoTranscurrido } from '../../utils/helpers';
import { obtenerCliente } from '../../data/clientesFrecuentes';
import styles from './ModalDetalleOrden.module.css';

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
  const cliente = obtenerCliente(ordenSeleccionada.clienteId || 'sin-cliente');

  return (
    <div className={styles.modalOverlay} onClick={cerrarDetalleOrden}>
      <div className={styles.modalDetalle} onClick={(e) => e.stopPropagation()}>
        <h2>📋 Detalle Orden #{ordenSeleccionada.numeroOrden}</h2>
        
        {/* INFORMACIÓN DEL CLIENTE - ESTILOS CORREGIDOS */}
        <div className={styles.infoClienteModal}>
          <div 
            className={styles.avatarClienteGrande} 
            style={{ backgroundColor: cliente.color }}
          >
            {cliente.iniciales || '👤'}
          </div>
          <div className={styles.datosCliente}>
            <p className={styles.nombreClienteGrande}>{cliente.nombre}</p>
            <p className={styles.labelCliente}>Cliente de la orden</p>
          </div>
        </div>

        <div className={styles.infoOrden}>
          <p><strong>Estado:</strong> {ordenSeleccionada.estado}</p>
          <p><strong>Fecha:</strong> {ordenSeleccionada.fecha} - {ordenSeleccionada.hora}</p>
          <p><strong>Tiempo transcurrido:</strong> {calcularTiempoTranscurrido(ordenSeleccionada.fechaCreacion)} minutos</p>
        </div>

        {!modoAgregarProductos ? (
          <>
            <div className={styles.productosOrden}>
              <h3>Productos:</h3>
              {ordenSeleccionada.productos && ordenSeleccionada.productos.length > 0 ? (
                ordenSeleccionada.productos.map((prod, index) => (
                  <div key={index} className={styles.productoDetalle}>
                    <span>{prod.nombre} x{prod.cantidad}</span>
                    <span>${(prod.precio * prod.cantidad).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p>No hay productos en esta orden</p>
              )}
            </div>

            <div className={styles.totalOrdenDetalle}>
              <h3>Total: ${ordenSeleccionada.total.toLocaleString()}</h3>
            </div>

            <div className={styles.accionesDetalle}>
              <button onClick={iniciarAgregarProductos}>
                ➕ Agregar Productos
              </button>
              <button 
                className={styles.botonPagar}
                onClick={() => procesarPagoPendiente(ordenSeleccionada)}
              >
                💳 Procesar Pago
              </button>
              <button 
                className={styles.botonCancelarOrden}
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
            <div className={styles.agregarProductosModo}>
              <h3>Agregar nuevos productos</h3>
              
              <div className={styles.categoriasMini}>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    className={categoriaActual === cat.id ? styles.activo : ''}
                    onClick={() => setCategoriaActual(cat.id)}
                  >
                    {cat.icono}
                  </button>
                ))}
              </div>

              <div className={styles.gridProductosMini}>
                {productos[categoriaActual].map(producto => {
                  const disponible = verificarDisponibilidad(producto.id, 1, inventario);

                  return (
                    <div
                      key={producto.id}
                      className={`${styles.productoMini} ${!disponible ? styles.productoAgotado : ''}`}
                      onClick={() => disponible && agregarProductoNuevo(producto)}
                      style={{ 
                        cursor: disponible ? 'pointer' : 'not-allowed',
                        opacity: disponible ? 1 : 0.7
                      }}
                    >
                      <span>{producto.nombre}</span>
                      <span>${producto.precio.toLocaleString()}</span>
                      {!disponible && (
                        <span className={styles.iconoAgotado}>❌</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {productosNuevos.length > 0 && (
                <div className={styles.productosNuevosLista}>
                  <h4>Productos a agregar:</h4>
                  {productosNuevos.map(item => (
                    <div key={item.id} className={styles.productoNuevoItem}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <div>
                        <button onClick={() => quitarProductoNuevo(item.id)}>-</button>
                        <button onClick={() => agregarProductoNuevo(item)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.accionesAgregar}>
                <button 
                  className={styles.botonConfirmar}
                  onClick={confirmarProductosAgregados}
                  disabled={productosNuevos.length === 0}
                >
                  ✅ Confirmar Productos
                </button>
                <button 
                  className={styles.botonCancelar}
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