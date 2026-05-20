import fs from 'fs/promises';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MiniBlog API',
      version: '1.0.0',
      description: 'API REST para gestionar usuarios y posts',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const outputPath = path.resolve('docs/openapi.json');

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(swaggerSpec, null, 2) + '\n', 'utf8');
console.log(`OpenAPI JSON generado en ${outputPath}`);
