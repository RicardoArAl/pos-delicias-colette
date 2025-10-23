// src/components/pedidos/VistaPedidos.js
import React from 'react';
import PanelProductos from './PanelProductos';
import PanelPedido from './PanelPedido';
import styles from './VistaPedidos.module.css';

const VistaPedidos = ({ 
  categorias,
  categoriaActual,
  setCategoriaActual,
  productos,
  agregarAlPedido,
  verificarDisponibilidad,
  inventario,
  pedido,
  quitarDelPedido,
  eliminarDelPedido,
  calcularTotal,
  guardarComoPendiente,
  abrirPago
}) => {
  return (
    <div className={styles.contenedorPrincipal}>
      <PanelProductos
        categorias={categorias}
        categoriaActual={categoriaActual}
        setCategoriaActual={setCategoriaActual}
        productos={productos}
        agregarAlPedido={agregarAlPedido}
        verificarDisponibilidad={verificarDisponibilidad}
        inventario={inventario}
      />
      
      <PanelPedido
        pedido={pedido}
        quitarDelPedido={quitarDelPedido}
        agregarAlPedido={agregarAlPedido}
        eliminarDelPedido={eliminarDelPedido}
        calcularTotal={calcularTotal}  
        guardarComoPendiente={guardarComoPendiente}
        abrirPago={abrirPago}
      />
    </div>
  );
};

export default VistaPedidos;