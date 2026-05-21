import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db/db.js';

let authorId = null;
let postId = null;

// ======================
// SETUP BASE DE DATOS
// ======================
beforeAll(async () => {
  console.log('🧪 Inicializando tests...');

  // fuerza conexión DB
  await db.query('SELECT 1');

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

// ======================
// CLEANUP
// ======================
afterAll(async () => {
  await db.end?.();
});

// ======================
// TESTS
// ======================
describe('API MiniBlog', () => {

  // ======================
  // AUTHORS
  // ======================
  describe('Authors', () => {

    it('GET /authors debe retornar vacío', async () => {
      const res = await request(app).get('/authors');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('POST /authors debe crear autor', async () => {
      const res = await request(app)
        .post('/authors')
        .send({
          name: 'Juan Pérez',
          email: 'juan@example.com',
          bio: 'Escritor'
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();

      authorId = res.body.id;
    });

    it('GET /authors/:id debe traer autor', async () => {
      const res = await request(app).get(`/authors/${authorId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(authorId);
    });

    // ======================
    // ERRORES AUTHORS
    // ======================
    describe('Errores Authors', () => {

      it('debe rechazar email inválido', async () => {
        const res = await request(app)
          .post('/authors')
          .send({
            name: 'Test',
            email: 'invalid-email'
          });

        expect(res.status).toBe(400);
      });

      it('debe rechazar nombre vacío', async () => {
        const res = await request(app)
          .post('/authors')
          .send({
            name: '',
            email: 'test2@mail.com'
          });

        expect(res.status).toBe(400);
      });

      it('debe rechazar email duplicado', async () => {
        await request(app).post('/authors').send({
          name: 'User 1',
          email: 'dup@mail.com'
        });

        const res = await request(app)
          .post('/authors')
          .send({
            name: 'User 2',
            email: 'dup@mail.com'
          });

        expect(res.status).toBe(400);
      });

      it('GET author inexistente debe devolver 404', async () => {
        const res = await request(app).get('/authors/99999');
        expect(res.status).toBe(404);
      });

    });

  });

  // ======================
  // POSTS
  // ======================
  describe('Posts', () => {

    it('GET /posts debe retornar vacío', async () => {
      const res = await request(app).get('/posts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /posts debe crear post', async () => {
      const res = await request(app)
        .post('/posts')
        .send({
          title: 'Mi post',
          content: 'Contenido',
          author_id: authorId,
          published: true
        });

      expect(res.status).toBe(201);

      postId = res.body.id;
    });

    it('GET /posts/:id debe traer post', async () => {
      const res = await request(app).get(`/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(postId);
    });

    // ======================
    // ERRORES POSTS
    // ======================
    describe('Errores Posts', () => {

      it('debe rechazar post sin título', async () => {
        const res = await request(app)
          .post('/posts')
          .send({
            content: 'contenido',
            author_id: authorId
          });

        expect(res.status).toBe(400);
      });

      it('debe rechazar post sin contenido', async () => {
        const res = await request(app)
          .post('/posts')
          .send({
            title: 'titulo',
            author_id: authorId
          });

        expect(res.status).toBe(400);
      });

      it('debe rechazar author_id inexistente', async () => {
        const res = await request(app)
          .post('/posts')
          .send({
            title: 'post',
            content: 'contenido',
            author_id: 99999
          });

        expect(res.status).toBe(404);
      });

      it('GET post inexistente debe devolver 404', async () => {
        const res = await request(app).get('/posts/99999');
        expect(res.status).toBe(404);
      });

    });

  });

  // ======================
  // DELETE
  // ======================
  describe('DELETE', () => {

    it('DELETE /posts/:id', async () => {
      const res = await request(app).delete(`/posts/${postId}`);
      expect(res.status).toBe(200);
    });

    it('DELETE /authors/:id', async () => {
      const res = await request(app).delete(`/authors/${authorId}`);
      expect(res.status).toBe(200);
    });

  });

});