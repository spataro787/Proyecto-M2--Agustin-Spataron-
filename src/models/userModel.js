import db from '../db/db.js';

// ===== USUARIOS =====

export const getAllUsers = async () => {
  const result = await db.query('SELECT id, name, email, created_at FROM users');
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createUser = async (name, email) => {
  const result = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
    [name, email]
  );
  return result.rows[0];
};

export const updateUser = async (id, name, email) => {
  const result = await db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
    [name, email, id]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};
