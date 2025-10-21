// src/firebaseService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Nombre de la colección en Firestore
const VENTAS_COLLECTION = 'ventas';

/**
 * Guarda una venta en Firestore
 * @param {Object} venta - Objeto con los datos de la venta
 * @returns {Promise<string>} - ID del documento creado
 */
export const guardarVentaFirebase = async (venta) => {
  try {
    // Convertir la fecha string a Timestamp de Firebase para mejor ordenamiento
    const ventaConTimestamp = {
      ...venta,
      fechaCreacion: Timestamp.now() // Timestamp actual
    };

    const docRef = await addDoc(collection(db, VENTAS_COLLECTION), ventaConTimestamp);
    console.log('✅ Venta guardada en Firebase con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al guardar venta en Firebase:', error);
    throw error;
  }
};

/**
 * Obtiene todas las ventas de Firestore
 * @returns {Promise<Array>} - Array de ventas
 */
export const obtenerVentasFirebase = async () => {
  try {
    const q = query(
      collection(db, VENTAS_COLLECTION),
      orderBy('fechaCreacion', 'desc') // Ordenar por fecha de creación descendente
    );
    
    const querySnapshot = await getDocs(q);
    const ventas = [];
    
    querySnapshot.forEach((doc) => {
      ventas.push({
        firebaseId: doc.id, // ID del documento en Firebase
        ...doc.data()
      });
    });
    
    console.log(`✅ ${ventas.length} ventas obtenidas de Firebase`);
    return ventas;
  } catch (error) {
    console.error('❌ Error al obtener ventas de Firebase:', error);
    throw error;
  }
};

/**
 * Obtiene el próximo número de orden
 * @param {Array} ventas - Array de ventas existentes
 * @returns {number} - Próximo número de orden
 */
export const obtenerProximoNumeroOrdenFirebase = (ventas) => {
  if (ventas.length === 0) return 1000;
  const ultimaOrden = Math.max(...ventas.map(v => v.numeroOrden || 0));
  return ultimaOrden + 1;
};