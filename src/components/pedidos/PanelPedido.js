// src/components/pedidos/PanelPedido.js
import React, { useState } from 'react';
import { clientesFrecuentes } from '../../data/clientesFrecuentes';

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
            <div className="contenedor-pendiente">
              <button 
                className="boton-pendiente"
                onClick={toggleSelectorCliente}
              >
                ⏳ Guardar como Pendiente
              </button>

              {mostrarSelectorCliente && (
                <div className="selector-cliente-dropdown">
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
                  <div className="botones-selector">
                    <button 
                      className="btn-confirmar-cliente"
                      onClick={manejarGuardarPendiente}
                    >
                      ✓ Guardar
                    </button>
                    <button 
                      className="btn-cancelar-cliente"
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
              className="boton-pagar"
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