import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../src/models/postModel.js";

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
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Título y contenido son requeridos" });
    }

    const post = await createPost(title, content, author);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExistingPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Título y contenido son requeridos" });
    }

    const post = await updatePost(id, title, content);

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
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
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json({ message: "Post eliminado correctamente", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
