import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME = 'miniblog',
  DATABASE_URL,
} = process.env;

const dbConfig = DATABASE_URL
  ? { connectionString: DATABASE_URL }
  : {
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
    };

const authors = [
  { name: 'Juan Pérez', email: 'juan@example.com', bio: 'Autor de ejemplo' },
  { name: 'María López', email: 'maria@example.com', bio: 'Editora y escritora' },
];

const posts = [
  { title: 'Bienvenida al MiniBlog', content: 'Este es el primer post de ejemplo.', published: true, authorEmail: 'juan@example.com' },
  { title: 'Segundo post', content: 'Contenido del segundo post de ejemplo.', published: false, authorEmail: 'juan@example.com' },
  { title: 'Post de María', content: 'Post escrito por María López.', published: true, authorEmail: 'maria@example.com' },
];

const run = async () => {
  const pool = new Pool(dbConfig);
  try {
    for (const a of authors) {
      const res = await pool.query(
        `INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [a.name, a.email, a.bio]
      );
      console.log(`Autor insertado/actualizado: ${a.email} (id ${res.rows[0].id})`);
    }

    for (const p of posts) {
      const authorRes = await pool.query('SELECT id FROM authors WHERE email = $1', [p.authorEmail]);
      if (authorRes.rowCount === 0) {
        console.warn(`Autor no encontrado para email ${p.authorEmail}, salto post '${p.title}'`);
        continue;
      }
      const authorId = authorRes.rows[0].id;
      await pool.query(
        `INSERT INTO posts (title, content, published, author_id)
         VALUES ($1, $2, $3, $4)`,
        [p.title, p.content, p.published, authorId]
      );
      console.log(`Post insertado: '${p.title}' -> autor ${p.authorEmail}`);
    }

    console.log('Seed seguro completado.');
  } catch (err) {
    console.error('Error en seed-safe:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
