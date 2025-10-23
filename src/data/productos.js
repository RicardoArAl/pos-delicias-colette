// src/data/productos.js

export const productos = {
  empanadas: [
    { id: 'e1', nombre: 'Arroz pollo', precio: 3000, categoria: 'empanadas', descripcion: 'Empanada con arroz y pollo' },
    { id: 'e2', nombre: 'Arroz carne', precio: 3000, categoria: 'empanadas', descripcion: 'Empanada con arroz y carne' },
    { id: 'e3', nombre: 'Papa carne', precio: 3000, categoria: 'empanadas', descripcion: 'Empanada con papa y carne' },
    { id: 'e4', nombre: 'Pizza', precio: 3500, categoria: 'empanadas', descripcion: 'Empanada con queso, tocineta y maiz' },
    { id: 'e5', nombre: 'Pollo champiñon', precio: 4000, categoria: 'empanadas', descripcion: 'Empanada con champiñon y pollo' },
    { id: 'e6', nombre: 'Papa carne/pollo', precio: 4500, categoria: 'empanadas', descripcion: 'Papa rellena de carne o pollo desmechado' }
  ],
  perros: [
    { id: 'p1', nombre: 'Perro Caliente', precio: 14500, categoria: 'perros', descripcion: 'Salchicha americana, tocineta, queso, papa chip y cebolla caramelizada' },
    { id: 'p2', nombre: 'Choriperro', precio: 14500, categoria: 'perros', descripcion: 'Chorizo, tocineta, queso, papa chip y cebolla caramelizada' },
    { id: 'p3', nombre: 'Perro en Combo', precio: 18500, categoria: 'perros', descripcion: 'Perro caliente con porción de papa y gaseosa Postobón' },
    { id: 'p4', nombre: 'Perro Especial', precio: 20000, categoria: 'perros', descripcion: 'Con carne o pollo desmechado, porción de papa y gaseosa' }
  ],
  hamburguesas: [
    { id: 'h1', nombre: 'Sencilla', precio: 12000, categoria: 'hamburguesas', descripcion: 'Carne 100g, lechuga, tomate, cebolla caramelizada y queso' },
    { id: 'h2', nombre: 'Especial', precio: 15000, categoria: 'hamburguesas', descripcion: 'Carne 100g, lechuga, tomate, queso, papa chip, tocineta y papas' },
    { id: 'h3', nombre: 'Super Especial', precio: 20000, categoria: 'hamburguesas', descripcion: 'Carne 100g, doble queso, plátano, papa chip, tocineta y papas' },
    { id: 'h4', nombre: 'Doble Carne', precio: 30000, categoria: 'hamburguesas', descripcion: 'Carne y pechuga, doble queso, plátano/maíz, huevo, tocineta y papas' }
  ],
  combos: [
    { id: 'c1', nombre: 'Combo Perros', precio: 24000, categoria: 'combos', descripcion: 'Dos perros calientes con gaseosa Postobón personal' },
    { id: 'c2', nombre: 'Combo Hamburguesas', precio: 28000, categoria: 'combos', descripcion: 'Dos hamburguesas con porción de papas' }
  ],
  salchipapas: [
    { 
      id: 's1', 
      nombre: 'Salchipapa', 
      precio: 0, 
      categoria: 'salchipapas', 
      descripcion: 'Papa, plátano, tocineta, proteína, salchicha, lechuga y queso',
      precioVariable: true, 
      precioMinimo: 25000 
    },
    { 
      id: 's2', 
      nombre: 'Mazorcada', 
      precio: 0, 
      categoria: 'salchipapas', 
      descripcion: 'Maíz tierno, proteína, tocineta, papa, papa chip, queso y plátano',
      precioVariable: true, 
      precioMinimo: 25000 
    }
  ],
  platos: [
    { id: 'pl1', nombre: 'Chorizo con Arepa', precio: 7500, categoria: 'platos', descripcion: 'Chorizo con arepa' },
    { id: 'pl2', nombre: 'Pechuga a la Plancha', precio: 23000, categoria: 'platos', descripcion: 'Pechuga con porción de papas y ensalada' },
    { id: 'pl3', nombre: 'Carne a la Plancha', precio: 23000, categoria: 'platos', descripcion: 'Carne con porción de papas y ensalada' }
  ],
  bebidas: [
    { id: 'b1', nombre: 'Gaseosa Postobón', precio: 3000, categoria: 'bebidas', descripcion: '' },
    { id: 'b2', nombre: 'Coca Cola 250ml', precio: 3500, categoria: 'bebidas', descripcion: '' },
    { id: 'b3', nombre: 'Coca Cola 350ml', precio: 3000, categoria: 'bebidas', descripcion: '' },
    { id: 'b4', nombre: 'Postobón 1.5L', precio: 6000, categoria: 'bebidas', descripcion: '' },
    { id: 'b5', nombre: 'Coca Cola 1.5L', precio: 7500, categoria: 'bebidas', descripcion: '' },
    { id: 'b6', nombre: 'Cerveza Andina', precio: 3000, categoria: 'bebidas', descripcion: '' },
    { id: 'b7', nombre: 'Cerveza', precio: 3500, categoria: 'bebidas', descripcion: '' },
    { id: 'b8', nombre: 'Jugos Hit', precio: 3000, categoria: 'bebidas', descripcion: '' },
    { id: 'b9', nombre: 'Mr. Tea', precio: 3000, categoria: 'bebidas', descripcion: '' }
  ],
  otros: [
    { id: 'o1', nombre: 'Cigarrillos', precio: 1300, categoria: 'otros', descripcion: '' },
    { id: 'o2', nombre: 'Tinto', precio: 1500, categoria: 'otros', descripcion: '' },
    { id: 'o3', nombre: 'Aromatica', precio: 1500, categoria: 'otros', descripcion: '' },
    { id: 'o4', nombre: 'Cafe', precio: 3000, categoria: 'otros', descripcion: '' }
  ],
};

export const categorias = [
  { id: 'empanadas', nombre: 'Empanadas', icono: '🥟' },
  { id: 'perros', nombre: 'Perros', icono: '🌭' },
  { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔' },
  { id: 'combos', nombre: 'Combos', icono: '🎁' },
  { id: 'salchipapas', nombre: 'Salchipapas', icono: '🍟' },
  { id: 'platos', nombre: 'Platos', icono: '🍽️' },
  { id: 'bebidas', nombre: 'Bebidas', icono: '🥤' },
  { id: 'otros', nombre: 'Otros', icono: '🧺' }
];