import React, { useState } from 'react';
import { calcularTiempoTranscurrido, obtenerColorTiempo } from '../../utils/helpers';
import { obtenerCliente, clientesFrecuentes } from '../../data/clientesFrecuentes';

const VistaPendientes = ({ 
  ordenesPendientes, 
  abrirDetalleOrden,
  procesarPagoPendiente 
}) => {
  const [filtroCliente, setFiltroCliente] = useState('todos');

  const ordenesFiltradas = filtroCliente === 'todos' 
    ? ordenesPendientes
    : ordenesPendientes.filter(o => o.clienteId === filtroCliente);

  // Calcular totales por cliente
  const totalesPorCliente = ordenesPendientes.reduce((acc, orden) => {
    const clienteId = orden.clienteId || 'sin-cliente';
    if (!acc[clienteId]) {
      acc[clienteId] = { cantidad: 0, total: 0 };
    }
    acc[clienteId].cantidad += 1;
    acc[clienteId].total += orden.total;
    return acc;
  }, {});

  return (
    <div className="vista-pendientes">
      <div className="header-pendientes">
        <h2>⏳ Órdenes Pendientes ({ordenesFiltradas.length})</h2>
        
        {/* Filtro discreto por cliente */}
        {ordenesPendientes.length > 0 && (
          <div className="filtro-clientes-mini">
            <select 
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="select-filtro-cliente"
            >
              <option value="todos">Todos ({ordenesPendientes.length})</option>
              {clientesFrecuentes
                .filter(c => c.id !== 'sin-cliente' && totalesPorCliente[c.id])
                .map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.iniciales} - {cliente.nombre} ({totalesPorCliente[cliente.id]?.cantidad || 0})
                  </option>
                ))
              }
            </select>
          </div>
        )}
      </div>

      {ordenesFiltradas.length === 0 ? (
        <div className="sin-pendientes">
          <p>✅ No hay órdenes pendientes</p>
        </div>
      ) : (
        <div className="grid-pendientes">
          {ordenesFiltradas.map(orden => {
            const minutos = calcularTiempoTranscurrido(orden.fechaCreacion);
            const colorTiempo = obtenerColorTiempo(minutos);
            const cliente = obtenerCliente(orden.clienteId);
            
            return (
              <div 
                key={orden.firebaseId} 
                className="tarjeta-orden-pendiente"
                style={{ borderLeft: `4px solid ${colorTiempo}` }}
              >
                <div className="orden-header">
                  <div className="orden-header-left">
                    {/* Badge de cliente solo si tiene uno asignado */}
                    {cliente.iniciales && (
                      <span 
                        className="badge-cliente"
                        style={{ backgroundColor: cliente.color }}
                        title={cliente.nombre}
                      >
                        {cliente.iniciales}
                      </span>
                    )}
                    <h3>Orden #{orden.numeroOrden}</h3>
                  </div>
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

      {/* Resumen por cliente (discreto, al final) */}
      {Object.keys(totalesPorCliente).length > 1 && (
        <div className="resumen-clientes">
          <h3>📊 Resumen por cliente</h3>
          <div className="grid-resumen-clientes">
            {Object.entries(totalesPorCliente)
              .filter(([id]) => id !== 'sin-cliente')
              .map(([clienteId, datos]) => {
                const cliente = obtenerCliente(clienteId);
                return (
                  <div key={clienteId} className="tarjeta-resumen-cliente">
                    <div 
                      className="icono-cliente-resumen"
                      style={{ backgroundColor: cliente.color }}
                    >
                      {cliente.iniciales}
                    </div>
                    <div className="info-cliente-resumen">
                      <span className="nombre-cliente-resumen">{cliente.nombre}</span>
                      <span className="datos-cliente-resumen">
                        {datos.cantidad} orden(es) - ${datos.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaPendientes;