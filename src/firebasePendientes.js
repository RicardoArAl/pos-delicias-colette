// src/firebasePendientes.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

const PENDIENTES_COLLECTION = 'ordenes-pendientes';

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

export const obtenerOrdenesPendientes = async () => {
  try {
    const q = query(
      collection(db, PENDIENTES_COLLECTION),
      where('estado', '==', 'pendiente')
    );
    
    const querySnapshot = await getDocs(q);
    const ordenes = [];
    
    querySnapshot.forEach((docSnap) => {
      ordenes.push({
        firebaseId: docSnap.id,
        ...docSnap.data()
      });
    });
    
    ordenes.sort((a, b) => {
      const fechaA = a.fechaCreacion?.toDate() || new Date(0);
      const fechaB = b.fechaCreacion?.toDate() || new Date(0);
      return fechaB - fechaA;
    });
    
    console.log(`✅ ${ordenes.length} órdenes pendientes obtenidas`);
    return ordenes;
  } catch (error) {
    console.error('❌ Error al obtener órdenes pendientes:', error);
    throw error;
  }
};

export const obtenerProximoNumeroOrdenTotal = (ventas, pendientes) => {
  const numerosVentas = ventas.map(v => v.numeroOrden || 0);
  const numerosPendientes = pendientes.map(p => p.numeroOrden || 0);
  const todosLosNumeros = [...numerosVentas, ...numerosPendientes];
  
  if (todosLosNumeros.length === 0) return 1001;
  
  const ultimaOrden = Math.max(...todosLosNumeros);
  return ultimaOrden + 1;
};

export const actualizarOrdenPendiente = async (firebaseId, cambios) => {
  try {
    const ordenRef = doc(db, PENDIENTES_COLLECTION, firebaseId);
    
    await updateDoc(ordenRef, {
      ...cambios,
      ultimaActualizacion: Timestamp.now()
    });
    
    console.log('✅ Orden actualizada');
  } catch (error) {
    console.error('❌ Error al actualizar orden:', error);
    throw error;
  }
};

export const cancelarOrden = async (firebaseId) => {
  try {
    const ordenRef = doc(db, PENDIENTES_COLLECTION, firebaseId);
    
    await updateDoc(ordenRef, {
      estado: 'cancelada',
      fechaCancelacion: new Date().toISOString().split('T')[0],
      horaCancelacion: new Date().toTimeString().split(' ')[0],
      ultimaActualizacion: Timestamp.now()
    });
    
    console.log('✅ Orden cancelada');
  } catch (error) {
    console.error('❌ Error al cancelar orden:', error);
    throw error;
  }
};