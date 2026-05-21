import {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
} from '../models/postModel.js';

import db from '../db/db.js';

// ======================
// GET ALL POSTS
// ======================
export const getPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// GET POST BY ID
// ======================
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// GET POSTS BY AUTHOR
// ======================
export const getAuthorPosts = async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await getPostsByAuthor(authorId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// CREATE POST (FIX IMPORTANTE)
// ======================
export const createNewPost = async (req, res) => {
  try {
    const { title, content, author_id, published } = req.body;

    // 1. validación básica
    if (!title || !content || !author_id) {
      return res.status(400).json({ error: 'Campos incompletos' });
    }

    // 2. verificar si author existe (CLAVE PARA EL TEST)
    const authorExists = await db.query(
      'SELECT * FROM authors WHERE id = $1',
      [author_id]
    );

    if (authorExists.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no existe' });
    }

    // 3. crear post
    const post = await createPost(
      title,
      content,
      author_id,
      published ?? false
    );

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// UPDATE POST
// ======================
export const updateExistingPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const post = await updatePost(id, title, content, published);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// DELETE POST
// ======================
export const deleteExistingPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await deletePost(id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};