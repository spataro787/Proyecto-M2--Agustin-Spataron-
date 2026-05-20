# MiniBlog API

API REST sencilla para gestionar autores y posts, desarrollada con Node.js, Express y PostgreSQL.

## Descripción

MiniBlog API permite realizar operaciones CRUD sobre autores y posts. Cada post pertenece a un autor y la API incluye validación de datos, protección contra inyección SQL y documentación OpenAPI.

## Requisitos

- Node.js 18 o superior
- npm
- PostgreSQL
- Railway (opcional, para despliegue)

## Instalación local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/miniblog-api.git
cd miniblog-api
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de ejemplo de entorno:
```bash
cp .env.example .env
```

4. Edita `.env` con tus credenciales de PostgreSQL:
```env
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
PORT=3000
NODE_ENV=development
```

> Si despliegas en Railway y usas `DATABASE_URL`, la aplicación detecta esa variable y se conecta con SSL.

## Configuración de la base de datos

### Opción 1: Usar el script de inicialización Node.js
```bash
node init-db.js
```

### Opción 2: Ejecutar SQL directo
```bash
psql -h localhost -U postgres -d miniblog -f sql/setup.sql
psql -h localhost -U postgres -d miniblog -f sql/seed.sql
```

### Cargar datos de ejemplo
```bash
psql -h localhost -U postgres -d miniblog -f sql/seed.sql
```

## Ejecutar la aplicación

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

La API estará disponible en `http://localhost:3000`.

## Ejecutar tests

```bash
npm test
```

## Documentación OpenAPI

La documentación interactiva está disponible en:
```bash
http://localhost:3000/api-docs
```

Archivos disponibles:
- `docs/openapi.yaml`
- `docs/openapi.json`

Regenera el JSON con:
```bash
npm run generate-docs
```

## Endpoints principales

### Autores

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Posts

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener posts de un autor |
| POST | `/posts` | Crear un post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## Scripts SQL

- `sql/setup.sql`: crea las tablas `authors` y `posts`
- `sql/seed.sql`: inserta datos de ejemplo para autores y posts

## Despliegue en Railway

1. Crea una cuenta en Railway: https://railway.app
2. Importa el repositorio
3. Agrega un plugin PostgreSQL
4. Configura las variables de entorno del proyecto

Variables recomendadas:
- `DATABASE_URL` (preferido)
- `PORT` (Railway suele asignarlo automáticamente)
- `NODE_ENV=production`

Railway genera una URL pública similar a:
```text
https://<project-name>.up.railway.app
```

Para la base de datos, Railway proporciona un `DATABASE_URL` interno que debes usar en las variables del proyecto.

## Uso de AI

Este proyecto fue revisado y documentado con asistencia de AI para asegurar la cobertura de los entregables: código fuente, scripts SQL, `.env.example`, tests y documentación OpenAPI.

## Seguridad

- Validación con `express-validator`
- SQL parametrizado
- CORS habilitado
- Variables sensibles fuera del repositorio (`.env`)

## Autor

Agustín Spataro
