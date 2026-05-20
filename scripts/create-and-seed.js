import fs from 'fs/promises';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME = 'miniblog',
  DATABASE_URL,
} = process.env;

const adminConfig = DATABASE_URL
  ? { connectionString: DATABASE_URL }
  : {
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      database: 'postgres',
    };

const run = async () => {
  const { Pool } = pg;
  const adminPool = new Pool(adminConfig);

  try {
    // comprobar existencia de la BD
    const existsRes = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (existsRes.rowCount === 0) {
      console.log(`Base de datos '${DB_NAME}' no existe. Creando...`);
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Base de datos '${DB_NAME}' creada.`);
    } else {
      console.log(`Base de datos '${DB_NAME}' ya existe.`);
    }
  } catch (err) {
    console.error('Error creando la base de datos:', err.message);
    await adminPool.end();
    process.exit(1);
  } finally {
    await adminPool.end();
  }

  // Conectar a la BD creada y ejecutar scripts
  const dbConfig = DATABASE_URL
    ? { connectionString: DATABASE_URL }
    : {
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
      };

  const db = new Pool(dbConfig);

  try {
    const setupPath = path.resolve('sql/setup.sql');
    const seedPath = path.resolve('sql/seed.sql');

    const setupSql = await fs.readFile(setupPath, 'utf8');
    const seedSql = await fs.readFile(seedPath, 'utf8');

    console.log('Ejecutando sql/setup.sql...');
    await db.query(setupSql);
    console.log('setup.sql ejecutado.');

    console.log('Ejecutando sql/seed.sql...');
    await db.query(seedSql);
    console.log('seed.sql ejecutado.');

    console.log('Base de datos inicializada y con datos de ejemplo.');
  } catch (err) {
    console.error('Error ejecutando scripts SQL:', err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
