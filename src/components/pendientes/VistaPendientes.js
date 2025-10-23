// src/components/pendientes/VistaPendientes.js
import React from 'react';
import { calcularTiempoTranscurrido, obtenerColorTiempo } from '../../utils/helpers';

const VistaPendientes = ({ 
  ordenesPendientes, 
  abrirDetalleOrden,
  procesarPagoPendiente 
}) => {
  return (
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
  );
};

export default VistaPendientes;