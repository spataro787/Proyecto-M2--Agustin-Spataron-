import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
} from '../controllers/userController.js';

const router = express.Router();

// Middleware de validación
const validateUser = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Obtener todos los autores
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Lista de autores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   created_at:
 *                     type: string
 */
router.get('/', getUsers);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Obtener un autor por ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del autor
 *       404:
 *         description: Autor no encontrado
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Crear un nuevo autor
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Autor creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validateUser, handleValidationErrors, createNewUser);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Actualizar un autor
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autor actualizado
 *       404:
 *         description: Autor no encontrado
 */
router.put('/:id', validateUser, handleValidationErrors, updateExistingUser);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Eliminar un autor
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Autor eliminado
 *       404:
 *         description: Autor no encontrado
 */
router.delete('/:id', deleteExistingUser);

export default router;
