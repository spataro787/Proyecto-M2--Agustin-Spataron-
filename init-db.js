import db from './src/db/db.js';

const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
  } finally {
    await db.end();
  }
};

initDb();