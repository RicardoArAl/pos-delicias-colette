// src/firebasePendientes.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Nombre de la colección en Firestore
const PENDIENTES_COLLECTION = 'ordenes-pendientes';

/**
 * Guarda una orden pendiente en Firestore
 * @param {Object} orden - Objeto con los datos de la orden
 * @returns {Promise<string>} - ID del documento creado
 */
export const guardarOrdenPendiente = async (orden) => {
  try {
    const ordenConTimestamp = {
      ...orden,
      fechaCreacion: Timestamp.now(),
      ultimaActualizacion: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, PENDIENTES_COLLECTION), ordenConTimestamp);
    console.log('✅ Orden pendiente guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al guardar orden pendiente:', error);
    throw error;
  }
};

/**
 * Obtiene todas las órdenes pendientes
 * @returns {Promise<Array>} - Array de órdenes pendientes
 */
export const obtenerOrdenesPendientes = async () => {
  try {
    // Versión simplificada sin orderBy para evitar índice compuesto
    const q = query(
      collection(db, PENDIENTES_COLLECTION),
      where('estado', '==', 'pendiente')
    );
    
    const querySnapshot = await getDocs(q);
    const ordenes = [];
    
    querySnapshot.forEach((doc) => {
      ordenes.push({
        firebaseId: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar manualmente en JavaScript
    ordenes.sort((a, b) => {
      const fechaA = a.fechaCreacion?.toDate() || new Date(0);
      const fechaB = b.fechaCreacion?.toDate() || new Date(0);
      return fechaB - fechaA; // Descendente (más reciente primero)
    });
    
    console.log(`✅ ${ordenes.length} órdenes pendientes obtenidas`);
    return ordenes;
  } catch (error) {
    console.error('❌ Error al obtener órdenes pendientes:', error);
    throw error;
  }
};

/**
 * Obtiene el próximo número de orden (considerando pendientes y pagadas)
 * @param {Array} ventas - Ventas pagadas
 * @param {Array} pendientes - Órdenes pendientes
 * @returns {number} - Próximo número de orden
 */
export const obtenerProximoNumeroOrdenTotal = (ventas, pendientes) => {
  const numerosVentas = ventas.map(v => v.numeroOrden || 0);
  const numerosPendientes = pendientes.map(p => p.numeroOrden || 0);
  const todosLosNumeros = [...numerosVentas, ...numerosPendientes];
  
  if (todosLosNumeros.length === 0) return 1000;
  
  const ultimaOrden = Math.max(...todosLosNumeros);
  return ultimaOrden + 1;
};

/**
 * Actualiza una orden pendiente agregando más productos
 * @param {string} firebaseId - ID del documento en Firebase
 * @param {Array} nuevosProductos - Productos a agregar
 * @param {number} nuevoTotal - Nuevo total de la orden
 * @returns {Promise<void>}
 */
export const agregarProductosAOrden = async (firebaseId, nuevosProductos, nuevoTotal) => {
  try {
    const ordenRef = doc(db, PENDIENTES_COLLECTION, firebaseId);
    
    await updateDoc(ordenRef, {
      itemsAgregados: nuevosProductos,
      total: nuevoTotal,
      ultimaActualizacion: Timestamp.now()
    });
    
    console.log('✅ Productos agregados a la orden');
  } catch (error) {
    console.error('❌ Error al agregar productos:', error);
    throw error;
  }
};

/**
 * Cambia el estado de una orden pendiente a pagada
 * @param {string} firebaseId - ID del documento en Firebase
 * @param {Object} datosPago - Información del pago
 * @returns {Promise<void>}
 */
export const marcarOrdenComoPagada = async (firebaseId, datosPago) => {
  try {
    const ordenRef = doc(db, PENDIENTES_COLLECTION, firebaseId);
    
    await updateDoc(ordenRef, {
      estado: 'pagada',
      metodoPago: datosPago.metodoPago,
      montoRecibido: datosPago.montoRecibido,
      cambio: datosPago.cambio,
      fechaPago: datosPago.fechaPago,
      horaPago: datosPago.horaPago,
      ultimaActualizacion: Timestamp.now()
    });
    
    console.log('✅ Orden marcada como pagada');
  } catch (error) {
    console.error('❌ Error al marcar como pagada:', error);
    throw error;
  }
};