import db from '../db/db.js';

// ===== POSTS =====

export const getAllPosts = async () => {
  const result = await db.query(`
    SELECT p.id, p.title, p.content, p.author_id, u.name as author_name, p.created_at, p.updated_at
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `);
  return result.rows;
};

export const getPostById = async (id) => {
  const result = await db.query(
    `SELECT p.id, p.title, p.content, p.author_id, u.name as author_name, p.created_at, p.updated_at
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getPostsByAuthor = async (authorId) => {
  const result = await db.query(
    `SELECT p.id, p.title, p.content, p.author_id, u.name as author_name, p.created_at, p.updated_at
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  );
  return result.rows;
};

export const createPost = async (title, content, authorId) => {
  const result = await db.query(
    `INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3)
     RETURNING id, title, content, author_id, created_at, updated_at`,
    [title, content, authorId]
  );
  return result.rows[0];
};

export const updatePost = async (id, title, content) => {
  const result = await db.query(
    `UPDATE posts SET title = $1, content = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, title, content, author_id, created_at, updated_at`,
    [title, content, id]
  );
  return result.rows[0];
};

export const deletePost = async (id) => {
  const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};