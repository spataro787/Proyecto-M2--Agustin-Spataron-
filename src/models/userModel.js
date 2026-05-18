import db from '../db/db.js';

// ===== AUTORES =====

export const getAllUsers = async () => {
  const result = await db.query('SELECT id, name, email, bio, created_at FROM authors');
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await db.query(
    'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createUser = async (name, email, bio) => {
  const result = await db.query(
    'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id, name, email, bio, created_at',
    [name, email, bio]
  );
  return result.rows[0];
};

export const updateUser = async (id, name, email, bio) => {
  const result = await db.query(
    'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING id, name, email, bio, created_at',
    [name, email, bio, id]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM authors WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};
