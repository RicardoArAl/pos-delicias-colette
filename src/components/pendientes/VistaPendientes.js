// src/components/pendientes/VistaPendientes.js
import React from 'react';
import { calcularTiempoTranscurrido, obtenerColorTiempo } from '../../utils/helpers';
import { obtenerCliente } from '../../data/clientesFrecuentes';
import styles from './VistaPendientes.module.css';

const VistaPendientes = ({ 
  ordenesPendientes, 
  abrirDetalleOrden,
  procesarPagoPendiente 
}) => {
  return (
    <div className={styles.vistaPendientes}>
      <div className={styles.headerPendientes}>
        <h2>⏳ Órdenes Pendientes ({ordenesPendientes.length})</h2>
      </div>

      {ordenesPendientes.length === 0 ? (
        <div className={styles.sinPendientes}>
          <p>✅ No hay órdenes pendientes</p>
        </div>
      ) : (
        <div className={styles.gridPendientes}>
          {ordenesPendientes.map(orden => {
            const minutos = calcularTiempoTranscurrido(orden.fechaCreacion);
            const colorTiempo = obtenerColorTiempo(minutos);
            const cliente = obtenerCliente(orden.clienteId || 'sin-cliente');
            
            return (
              <div 
                key={orden.firebaseId} 
                className={styles.tarjetaOrdenPendiente}
                style={{ borderLeft: `4px solid ${colorTiempo}` }}
              >
                <div className={styles.ordenHeader}>
                  <h3>Orden #{orden.numeroOrden}</h3>
                  <span 
                    className={styles.tiempoTranscurrido}
                    style={{ background: colorTiempo }}
                  >
                    {minutos} min
                  </span>
                </div>
                
                {/* CLIENTE VISIBLE CON AVATAR */}
                <div className={styles.clienteInfo}>
                  <div 
                    className={styles.avatarCliente} 
                    style={{ backgroundColor: cliente.color }}
                  >
                    {cliente.iniciales || '👤'}
                  </div>
                  <div>
                    <p className={styles.nombreCliente}>
                      {cliente.nombre}
                    </p>
                  </div>
                </div>
                
                <div className={styles.ordenInfo}>
                  <p>📅 {orden.fecha} - {orden.hora}</p>
                  <p>🛒 {orden.cantidadProductos} productos</p>
                  <p className={styles.ordenTotal}>💰 ${orden.total.toLocaleString()}</p>
                </div>

                <div className={styles.ordenAcciones}>
                  <button onClick={() => abrirDetalleOrden(orden)}>
                    👁️ Ver Detalles
                  </button>
                  <button 
                    className={styles.botonPagarPendiente}
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