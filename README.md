# MiniBlog API

API REST sencilla para gestionar autores y posts, desarrollada con Node.js, Express y PostgreSQL.

## 📋 Características

- ✅ CRUD completo para autores y posts
- ✅ Relación 1:N entre autores y posts
- ✅ Validación de datos con express-validator
- ✅ SQL parametrizado (protegido contra SQL injection)
- ✅ Tests unitarios con Supertest y Vitest
- ✅ Documentación OpenAPI/Swagger en `/api-docs`
- ✅ CORS habilitado

## 🛠️ Tecnologías

- **Runtime:** Node.js
- **Framework:** Express 5.x
- **Base de datos:** PostgreSQL
- **Validación:** express-validator
- **Testing:** Vitest + Supertest
- **Documentación:** Swagger/OpenAPI

## 📦 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/miniblog-api.git
cd miniblog-api
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura el archivo `.env`:**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:
```
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
PORT=3000
NODE_ENV=development
```

4. **Inicializa la base de datos:**
```bash
node init-db.js
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

### Producción
```bash
npm start
```

### Tests
```bash
npm test
```

## 📚 API Endpoints

### Autores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un nuevo autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Posts

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener posts de un autor |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## 📖 Documentación Swagger

Accede a la documentación interactiva en:
```
http://localhost:3000/api-docs
```

## 💾 Estructura de BD

### Tabla `authors`
```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `posts`
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Ejemplos de Requests

### Crear autor
```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "bio": "Autor de ejemplo"
  }'
```

### Crear post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primer post",
    "content": "Este es el contenido del post",
    "author_id": 1
  }'
```

### Obtener todos los posts
```bash
curl http://localhost:3000/posts
```

## 🔒 Seguridad

- ✅ SQL parametrizado en todas las queries
- ✅ Validación de entrada con express-validator
- ✅ CORS configurado
- ✅ Variables sensibles en `.env` (no en el repositorio)

## 🚀 Despliegue en Railway

1. Crea una cuenta en [Railway](https://railway.app)
2. Crea un nuevo proyecto y conecta tu repositorio
3. Agrega una base de datos PostgreSQL
4. Configura las variables de entorno en Railway
5. Despliega

## 📝 Licencia

ISC

## 👨‍💻 Autor

Agustín Spataro

---

**Nota:** Este proyecto es educativo y forma parte del curso de Full Stack.
