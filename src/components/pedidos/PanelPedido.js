// src/components/pedidos/PanelPedido.js
import React, { useState } from 'react';
import { clientesFrecuentes } from '../../data/clientesFrecuentes';
import styles from './PanelPedido.module.css';

const PanelPedido = ({ 
  pedido, 
  quitarDelPedido, 
  agregarAlPedido, 
  eliminarDelPedido, 
  calcularTotal,
  guardarComoPendiente,
  abrirPago 
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState('sin-cliente');
  const [mostrarSelectorCliente, setMostrarSelectorCliente] = useState(false);

  const manejarGuardarPendiente = () => {
    guardarComoPendiente(clienteSeleccionado);
    setClienteSeleccionado('sin-cliente');
    setMostrarSelectorCliente(false);
  };

  const toggleSelectorCliente = () => {
    setMostrarSelectorCliente(!mostrarSelectorCliente);
  };

  return (
    <div className={styles.panelPedido}>
      <h2>🛒 Pedido Actual</h2>
      
      {pedido.length === 0 ? (
        <div className={styles.pedidoVacio}>
          <p>🍽️ No hay productos en el pedido</p>
        </div>
      ) : (
        <>
          <div className={styles.listaPedido}>
            {pedido.map(item => (
              <div key={item.id} className={styles.itemPedido}>
                <div className={styles.itemInfo}>
                  <h4>{item.nombre}</h4>
                  <p className={styles.itemPrecio}>${(item.precio * item.cantidad).toLocaleString()}</p>
                </div>
                <div className={styles.itemControles}>
                  <button onClick={() => quitarDelPedido(item.id)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => agregarAlPedido(item)}>+</button>
                  <button 
                    className={styles.botonEliminar}
                    onClick={() => eliminarDelPedido(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalPedido}>
            <h3>Total: ${calcularTotal().toLocaleString()}</h3>
          </div>

          <div className={styles.accionesPedido}>
            <div className={styles.contenedorPendiente}>
              <button 
                className={styles.botonPendiente}
                onClick={toggleSelectorCliente}
              >
                ⏳ Guardar como Pendiente
              </button>

              {mostrarSelectorCliente && (
                <div className={styles.selectorClienteDropdown}>
                  <label>Cliente (opcional):</label>
                  <select 
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                  >
                    {clientesFrecuentes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                  <div className={styles.botonesSelector}>
                    <button 
                      className={styles.btnConfirmarCliente}
                      onClick={manejarGuardarPendiente}
                    >
                      ✓ Guardar
                    </button>
                    <button 
                      className={styles.btnCancelarCliente}
                      onClick={() => {
                        setMostrarSelectorCliente(false);
                        setClienteSeleccionado('sin-cliente');
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className={styles.botonPagar}
              onClick={abrirPago}
            >
              💰 Pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PanelPedido;