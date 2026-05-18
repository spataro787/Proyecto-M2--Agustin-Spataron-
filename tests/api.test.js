import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db/db.js';

let authorId = null;
let postId = null;

beforeAll(async () => {
  console.log('🧪 Inicializando tests...');

  await db.query('DROP TABLE IF EXISTS posts CASCADE;');
  await db.query('DROP TABLE IF EXISTS authors CASCADE;');

  await db.query(`
    CREATE TABLE authors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      published BOOLEAN DEFAULT FALSE,
      author_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
    );
  `);
});

afterAll(async () => {
  await db.end();
});

describe('API MiniBlog', () => {
  describe('GET /authors', () => {
    it('debería retornar lista vacía inicialmente', async () => {
      const response = await request(app).get('/authors');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /authors', () => {
    it('debería crear un nuevo autor', async () => {
      const response = await request(app)
        .post('/authors')
        .send({
          name: 'Juan Pérez',
          email: 'juan@example.com',
          bio: 'Escritor y desarrollador',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Juan Pérez');
      expect(response.body.email).toBe('juan@example.com');
      expect(response.body.bio).toBe('Escritor y desarrollador');

      authorId = response.body.id;
    });

    it('debería rechazar email inválido', async () => {
      const response = await request(app)
        .post('/authors')
        .send({
          name: 'Juan',
          email: 'correo-invalido',
        });

      expect(response.status).toBe(400);
    });

    it('debería rechazar nombre vacío', async () => {
      const response = await request(app)
        .post('/authors')
        .send({
          name: '',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
    });

    it('debería rechazar email duplicado', async () => {
      const response = await request(app)
        .post('/authors')
        .send({
          name: 'Otro Autor',
          email: 'juan@example.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /authors/:id', () => {
    it('debería obtener un autor por ID', async () => {
      const response = await request(app).get(`/authors/${authorId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(authorId);
      expect(response.body.name).toBe('Juan Pérez');
    });

    it('debería retornar 404 para ID inexistente', async () => {
      const response = await request(app).get('/authors/9999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /authors/:id', () => {
    it('debería actualizar un autor', async () => {
      const response = await request(app)
        .put(`/authors/${authorId}`)
        .send({
          name: 'Juan Actualizado',
          email: 'juan.nuevo@example.com',
          bio: 'Bio actualizada',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Juan Actualizado');
      expect(response.body.email).toBe('juan.nuevo@example.com');
      expect(response.body.bio).toBe('Bio actualizada');
    });
  });

  describe('GET /posts', () => {
    it('debería retornar lista vacía de posts inicialmente', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /posts', () => {
    it('debería crear un nuevo post', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Mi primer post',
          content: 'Este es el contenido del post',
          author_id: authorId,
          published: true,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Mi primer post');
      expect(response.body.author_id).toBe(authorId);
      expect(response.body.published).toBe(true);

      postId = response.body.id;
    });

    it('debería rechazar post sin título', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: '',
          content: 'Contenido',
          author_id: authorId,
        });

      expect(response.status).toBe(400);
    });

    it('debería rechazar post sin contenido', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Título',
          content: '',
          author_id: authorId,
        });

      expect(response.status).toBe(400);
    });

    it('debería rechazar post con author_id inválido', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Título',
          content: 'Contenido',
          author_id: 'no-es-numero',
        });

      expect(response.status).toBe(400);
    });

    it('debería rechazar post con author_id inexistente', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Título',
          content: 'Contenido',
          author_id: 9999,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /posts/:id', () => {
    it('debería obtener un post por ID', async () => {
      const response = await request(app).get(`/posts/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe('Mi primer post');
      expect(response.body.author_id).toBe(authorId);
      expect(response.body.author_name).toBe('Juan Actualizado');
    });

    it('debería retornar 404 para post inexistente', async () => {
      const response = await request(app).get('/posts/9999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /posts/author/:authorId', () => {
    it('debería retornar los posts del autor', async () => {
      const response = await request(app).get(`/posts/author/${authorId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].author_id).toBe(authorId);
    });
  });

  describe('PUT /posts/:id', () => {
    it('debería actualizar un post', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Post actualizado',
          content: 'Contenido actualizado',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Post actualizado');
      expect(response.body.content).toBe('Contenido actualizado');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('debería eliminar un post', async () => {
      const response = await request(app).delete(`/posts/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminado');
    });
  });

  describe('DELETE /authors/:id', () => {
    it('debería eliminar un autor', async () => {
      const response = await request(app).delete(`/authors/${authorId}`);

      expect(response.status).toBe(200);
    });
  });
});
