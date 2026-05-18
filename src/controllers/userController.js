import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const user = await createUser(name, email, bio || null);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    const user = await updateUser(id, name, email, bio || null);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
