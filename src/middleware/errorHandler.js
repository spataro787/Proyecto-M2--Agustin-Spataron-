export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Errores de validación de DB
  if (err.code === '23505') {
    return res.status(400).json({ error: 'El registro ya existe (violación de clave única)' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'El registro referenciado no existe' });
  }
  
  // Error genérico
  res.status(500).json({ error: 'Error interno del servidor' });
};
