import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import db from "./db/db.js";

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(cors());
app.use(express.json());

// ======================
// SWAGGER CONFIG
// ======================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MiniBlog API",
      version: "1.0.0",
      description: "API REST para gestionar autores y posts",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },

  // rutas donde swagger busca documentación
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ======================
// SWAGGER UI
// ======================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ======================
// ROUTES
// ======================
app.use("/authors", userRoutes);
app.use("/posts", postRoutes);

// ======================
// TEST DATABASE
// ======================
app.get("/test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");

    res.json({
      status: "ok",
      dbTime: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ======================
// HOME
// ======================
app.get("/", (req, res) => {
  res.json({
    message: "✅ API funcionando correctamente",
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use(errorHandler);

export default app;