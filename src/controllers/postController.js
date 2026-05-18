import {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
} from '../models/postModel.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const getAuthorPosts = async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await getPostsByAuthor(authorId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { title, content, author_id, published } = req.body;

    const post = await createPost(title, content, author_id, published ?? false);
    res.status(201).json(post);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: 'El autor especificado no existe' });
    }
    res.status(500).json({ error: error.message });
  }
};

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
