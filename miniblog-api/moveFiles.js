import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

const filesToMove = [
  {
    from: 'controllers-postController.js',
    to: '../controllers/postController.js'
  },
  {
    from: 'routes-postRoutes.js',
    to: '../routes/postRoutes.js'
  }
];

filesToMove.forEach(({ from, to }) => {
  const sourcePath = path.join(projectRoot, from);
  const destPath = path.join(projectRoot, to);
  
  if (fs.existsSync(sourcePath)) {
    const content = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`✅ Copiado: ${from} → ${to}`);
    fs.unlinkSync(sourcePath);
    console.log(`🗑️  Borrado: ${from}`);
  }
});

console.log("\n✅ Archivos reubicados correctamente");
