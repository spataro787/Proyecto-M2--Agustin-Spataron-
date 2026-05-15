#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🚀 Inicializando proyecto miniblog-api...\n");

try {
  // Mover archivos
  console.log("📦 Reubicando archivos...");
  execSync(`node moveFiles.js`, { cwd: __dirname, stdio: 'inherit' });
  
  console.log("\n✅ ¡Proyecto configurado correctamente!");
  console.log("\n📝 Próximos pasos:");
  console.log("   1. Configura tu .env con las credenciales de PostgreSQL");
  console.log("   2. Ejecuta: npm run dev");
  console.log("   3. Prueba: curl http://localhost:3000/posts");
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
