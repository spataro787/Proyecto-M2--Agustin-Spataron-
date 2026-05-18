import db from '../db/db.js';

// ===== POSTS =====

export const getAllPosts = async () => {
  const result = await db.query(`
    SELECT p.id,
           p.title,
           p.content,
           p.published,
           p.author_id,
           u.name AS author_name,
           u.email AS author_email,
           u.bio AS author_bio,
           p.created_at,
           p.updated_at
    FROM posts p
    JOIN authors u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `);
  return result.rows;
};

export const getPostById = async (id) => {
  const result = await db.query(
    `SELECT p.id,
            p.title,
            p.content,
            p.published,
            p.author_id,
            u.name AS author_name,
            u.email AS author_email,
            u.bio AS author_bio,
            p.created_at,
            p.updated_at
     FROM posts p
     JOIN authors u ON p.author_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getPostsByAuthor = async (authorId) => {
  const result = await db.query(
    `SELECT p.id,
            p.title,
            p.content,
            p.published,
            p.author_id,
            u.name AS author_name,
            u.email AS author_email,
            u.bio AS author_bio,
            p.created_at,
            p.updated_at
     FROM posts p
     JOIN authors u ON p.author_id = u.id
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  );
  return result.rows;
};

export const createPost = async (title, content, authorId, published = false) => {
  const result = await db.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, content, published, author_id, created_at, updated_at`,
    [title, content, authorId, published]
  );
  return result.rows[0];
};

export const updatePost = async (id, title, content, published) => {
  const fields = [];
  const values = [];

  if (title !== undefined) {
    values.push(title);
    fields.push(`title = $${values.length}`);
  }
  if (content !== undefined) {
    values.push(content);
    fields.push(`content = $${values.length}`);
  }
  if (published !== undefined) {
    values.push(published);
    fields.push(`published = $${values.length}`);
  }

  if (fields.length === 0) {
    const result = await db.query(
      `SELECT id, title, content, published, author_id, created_at, updated_at FROM posts WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  values.push(id);
  const query = `UPDATE posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING id, title, content, published, author_id, created_at, updated_at`;
  const result = await db.query(query, values);
  return result.rows[0];
};

export const deletePost = async (id) => {
  const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};