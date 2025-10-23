// src/components/pedidos/PanelPedido.js
import React from 'react';

const PanelPedido = ({ 
  pedido, 
  quitarDelPedido, 
  agregarAlPedido, 
  eliminarDelPedido, 
  calcularTotal,
  guardarComoPendiente,
  abrirPago 
}) => {
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
  );
};

export default PanelPedido;