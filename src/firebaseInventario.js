
// firebaseInventario.js - Sistema de Gestión de Inventario
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  Timestamp, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// ========================================
// INVENTARIO INICIAL
// ========================================

export const inventarioInicial = {
  // BEBIDAS
  'b1': { 
    id: 'b1',
    nombre: 'Gaseosa Postobón',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 50,
    stockMinimo: 20
  },
  'b2': { 
    id: 'b2',
    nombre: 'Coca Cola 250ml',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 30,
    stockMinimo: 15
  },
  'b3': { 
    id: 'b3',
    nombre: 'Coca Cola 350ml',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 40,
    stockMinimo: 15
  },
  'b4': { 
    id: 'b4',
    nombre: 'Postobón 1.5L',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 25,
    stockMinimo: 10
  },
  'b5': { 
    id: 'b5',
    nombre: 'Coca Cola 1.5L',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 20,
    stockMinimo: 10
  },
  'b6': { 
    id: 'b6',
    nombre: 'Cerveza Andina',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 48,
    stockMinimo: 24
  },
  'b7': { 
    id: 'b7',
    nombre: 'Cerveza',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 48,
    stockMinimo: 24
  },
  'b8': { 
    id: 'b8',
    nombre: 'Jugos Hit',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 30,
    stockMinimo: 15
  },
  'b9': { 
    id: 'b9',
    nombre: 'Mr. Tea',
    categoria: 'bebidas',
    unidad: 'unidades',
    stock: 30,
    stockMinimo: 15
  },
  
  // PROTEÍNAS
  'carne-hamburguesa': {
    id: 'carne-hamburguesa',
    nombre: 'Carne Hamburguesa',
    categoria: 'proteinas',
    unidad: 'unidades',
    stock: 100,
    stockMinimo: 30
  },
  'carne-res': {
    id: 'carne-res',
    nombre: 'Carne de Res',
    categoria: 'proteinas',
    unidad: 'porciones',
    stock: 50,
    stockMinimo: 15
  },
  'lomo-cerdo': {
    id: 'lomo-cerdo',
    nombre: 'Lomo de Cerdo',
    categoria: 'proteinas',
    unidad: 'porciones',
    stock: 40,
    stockMinimo: 15
  },
  'pechuga-pollo': {
    id: 'pechuga-pollo',
    nombre: 'Pechuga de Pollo',
    categoria: 'proteinas',
    unidad: 'porciones',
    stock: 60,
    stockMinimo: 20
  },
  
  // EMBUTIDOS
  'salchicha-americana': {
    id: 'salchicha-americana',
    nombre: 'Salchicha Americana',
    categoria: 'embutidos',
    unidad: 'unidades',
    stock: 80,
    stockMinimo: 25
  },
  'salchicha-normal': {
    id: 'salchicha-normal',
    nombre: 'Salchicha Normal',
    categoria: 'embutidos',
    unidad: 'unidades',
    stock: 100,
    stockMinimo: 30
  },
  'chorizo': {
    id: 'chorizo',
    nombre: 'Chorizo',
    categoria: 'embutidos',
    unidad: 'unidades',
    stock: 60,
    stockMinimo: 20
  },
  'tocineta': {
    id: 'tocineta',
    nombre: 'Tocineta',
    categoria: 'embutidos',
    unidad: 'unidades',
    stock: 100,
    stockMinimo: 10
  },
  'jamon': {
    id: 'jamon',
    nombre: 'Jamón',
    categoria: 'embutidos',
    unidad: 'unidades',
    stock: 100,
    stockMinimo: 10
  }
};

// ========================================
// MAPEO: PRODUCTOS → INGREDIENTES
// ========================================
// Define qué ingredientes consume cada producto del menú

export const recetasProductos = {
  // BEBIDAS (mapeo 1:1)
  'b1': [{ ingrediente: 'b1', cantidad: 1 }],
  'b2': [{ ingrediente: 'b2', cantidad: 1 }],
  'b3': [{ ingrediente: 'b3', cantidad: 1 }],
  'b4': [{ ingrediente: 'b4', cantidad: 1 }],
  'b5': [{ ingrediente: 'b5', cantidad: 1 }],
  'b6': [{ ingrediente: 'b6', cantidad: 1 }],
  'b7': [{ ingrediente: 'b7', cantidad: 1 }],
  'b8': [{ ingrediente: 'b8', cantidad: 1 }],
  'b9': [{ ingrediente: 'b9', cantidad: 1 }],
  
  // PERROS
  'p1': [ // Perro Caliente
    { ingrediente: 'salchicha-americana', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  'p2': [ // Choriperro
    { ingrediente: 'chorizo', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  'p3': [ // Perro en Combo
    { ingrediente: 'salchicha-americana', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 },
    { ingrediente: 'b1', cantidad: 1 }
  ],
  'p4': [ // Perro Especial
    { ingrediente: 'salchicha-americana', cantidad: 1 },
    { ingrediente: 'pechuga-pollo', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 },
    { ingrediente: 'b1', cantidad: 1 }
  ],
  
  // HAMBURGUESAS (1 hamburguesa = 1 carne)
  'h1': [ // Sencilla
    { ingrediente: 'carne-hamburguesa', cantidad: 1 }
  ],
  'h2': [ // Especial
    { ingrediente: 'carne-hamburguesa', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  'h3': [ // Super Especial
    { ingrediente: 'carne-hamburguesa', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  'h4': [ // Doble Carne
    { ingrediente: 'carne-hamburguesa', cantidad: 1 },
    { ingrediente: 'pechuga-pollo', cantidad: 1 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  
  // COMBOS
  'c1': [ // Combo Perros (2 perros)
    { ingrediente: 'salchicha-americana', cantidad: 2 },
    { ingrediente: 'b1', cantidad: 1 }
  ],
  'c2': [ // Combo Hamburguesas (2 hamburguesas)
    { ingrediente: 'carne-hamburguesa', cantidad: 2 },
    { ingrediente: 'tocineta', cantidad: 1 }
  ],
  
  // PLATOS
  'pl1': [ // Chorizo con Arepa
    { ingrediente: 'chorizo', cantidad: 1 },
    { ingrediente: 'arepa', cantidad: 1 }
  ],
  'pl2': [ // Pechuga a la Plancha
    { ingrediente: 'pechuga-pollo', cantidad: 1 }
  ],
  'pl3': [ // Carne a la Plancha
    { ingrediente: 'carne-res', cantidad: 1 }
  ]
  
  // NOTA: Empanadas, Salchipapas y Mazorcadas NO consumen inventario
  // porque tienen precios variables o ingredientes muy variados
};

// ========================================
// FUNCIONES FIREBASE
// ========================================

// Inicializar inventario en Firebase (solo primera vez)
export const inicializarInventario = async () => {
  try {
    const inventarioRef = doc(db, 'configuracion', 'inventario');
    const docSnap = await getDoc(inventarioRef);
    
    if (!docSnap.exists()) {
      await setDoc(inventarioRef, {
        items: inventarioInicial,
        ultimaActualizacion: Timestamp.now()
      });
      console.log('✅ Inventario inicializado');
      return inventarioInicial;
    } else {
      return docSnap.data().items;
    }
  } catch (error) {
    console.error('❌ Error al inicializar inventario:', error);
    return inventarioInicial;
  }
};

// Obtener inventario actual
export const obtenerInventario = async () => {
  try {
    const inventarioRef = doc(db, 'configuracion', 'inventario');
    const docSnap = await getDoc(inventarioRef);
    
    if (docSnap.exists()) {
      return docSnap.data().items;
    } else {
      return await inicializarInventario();
    }
  } catch (error) {
    console.error('❌ Error al obtener inventario:', error);
    return inventarioInicial;
  }
};

// Actualizar stock de un ingrediente
export const actualizarStock = async (ingredienteId, nuevaCantidad, motivo = 'Ajuste manual') => {
  try {
    const inventarioRef = doc(db, 'configuracion', 'inventario');
    const docSnap = await getDoc(inventarioRef);
    
    if (docSnap.exists()) {
      const items = docSnap.data().items;
      const cantidadAnterior = items[ingredienteId].stock;
      
      items[ingredienteId].stock = nuevaCantidad;
      
      await updateDoc(inventarioRef, {
        items: items,
        ultimaActualizacion: Timestamp.now()
      });
      
      // Registrar movimiento
      await registrarMovimiento(ingredienteId, cantidadAnterior, nuevaCantidad, motivo);
      
      console.log(`✅ Stock actualizado: ${ingredienteId} = ${nuevaCantidad}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error al actualizar stock:', error);
    return false;
  }
};

// Descontar ingredientes al procesar una venta
export const descontarInventario = async (productos) => {
  try {
    const inventarioRef = doc(db, 'configuracion', 'inventario');
    const docSnap = await getDoc(inventarioRef);
    
    if (!docSnap.exists()) return false;
    
    const items = docSnap.data().items;
    
    // Calcular descuentos por producto
    productos.forEach(producto => {
      const idOriginal = producto.idOriginal || producto.id; // Para productos con precio variable
      const receta = recetasProductos[idOriginal];
      
      if (receta) {
        receta.forEach(ingredienteReceta => {
          const ingredienteId = ingredienteReceta.ingrediente;
          const cantidadPorUnidad = ingredienteReceta.cantidad;
          const cantidadTotal = cantidadPorUnidad * producto.cantidad;
          
          if (items[ingredienteId]) {
            const stockAnterior = items[ingredienteId].stock;
            items[ingredienteId].stock = Math.max(0, stockAnterior - cantidadTotal);
            
            console.log(`📦 Descontado: ${ingredienteId} -${cantidadTotal} (${stockAnterior} → ${items[ingredienteId].stock})`);
          }
        });
      }
    });
    
    await updateDoc(inventarioRef, {
      items: items,
      ultimaActualizacion: Timestamp.now()
    });
    
    console.log('✅ Inventario descontado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al descontar inventario:', error);
    return false;
  }
};

// Verificar si un producto tiene stock disponible
export const verificarDisponibilidad = (productoId, cantidad, inventario) => {
  const receta = recetasProductos[productoId];
  
  if (!receta) return true; // Si no tiene receta, está disponible
  
  for (const ingrediente of receta) {
    const item = inventario[ingrediente.ingrediente];
    if (!item) continue;
    
    const stockNecesario = ingrediente.cantidad * cantidad;
    if (item.stock < stockNecesario) {
      console.log(`⚠️ Sin stock suficiente: ${item.nombre} (necesita ${stockNecesario}, tiene ${item.stock})`);
      return false; // No hay suficiente stock
    }
  }
  
  return true;
};

// Registrar movimiento de inventario
const registrarMovimiento = async (ingredienteId, cantidadAnterior, cantidadNueva, motivo) => {
  try {
    const movimientosRef = collection(db, 'movimientos-inventario');
    await addDoc(movimientosRef, {
      ingredienteId,
      cantidadAnterior,
      cantidadNueva,
      diferencia: cantidadNueva - cantidadAnterior,
      motivo,
      fecha: Timestamp.now()
    });
  } catch (error) {
    console.error('❌ Error al registrar movimiento:', error);
  }
};

// Obtener movimientos recientes
export const obtenerMovimientos = async (limite = 50) => {
  try {
    const movimientosRef = collection(db, 'movimientos-inventario');
    const q = query(movimientosRef, orderBy('fecha', 'desc'), limit(limite));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error al obtener movimientos:', error);
    return [];
  }
};