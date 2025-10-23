// src/components/pedidos/VistaPedidos.js
import React from 'react';
import PanelProductos from './PanelProductos';
import PanelPedido from './PanelPedido';

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
    <div className="contenedor-principal">
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