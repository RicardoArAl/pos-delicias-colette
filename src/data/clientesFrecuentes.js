export const clientesFrecuentes = [
  { id: 'sin-cliente', nombre: 'Sin cliente', iniciales: '', color: '#6b7280' },
  { id: 'mesa-1', nombre: 'Mesa 1', iniciales: 'M1', color: '#3b82f6' },
  { id: 'mesa-2', nombre: 'Mesa 2', iniciales: 'M2', color: '#8b5cf6' },
  { id: 'mesa-3', nombre: 'Afuera 1', iniciales: 'M3', color: '#ec4899' },
  { id: 'cliente-a', nombre: 'Afuera 2', iniciales: 'CA', color: '#10b981' },
  { id: 'cliente-b', nombre: 'Afuera 3', iniciales: 'CB', color: '#f59e0b' },
  { id: 'cliente-c', nombre: 'Afuera 4', iniciales: 'CC', color: '#ef4444' },
  { id: 'doña-yuri', nombre: 'Yuri', iniciales: 'CC', color: '#f39e9eff' },
];

export const obtenerCliente = (clienteId) => {
  return clientesFrecuentes.find(c => c.id === clienteId) || clientesFrecuentes[0];
};