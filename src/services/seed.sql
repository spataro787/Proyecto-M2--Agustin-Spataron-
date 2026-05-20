-- Seed data for MiniBlog API
INSERT INTO authors (name, email, bio) VALUES
  ('Juan Pérez', 'juan@example.com', 'Autor de ejemplo'),
  ('María López', 'maria@example.com', 'Editora y escritora');

INSERT INTO posts (title, content, published, author_id) VALUES
  ('Bienvenida al MiniBlog', 'Este es el primer post de ejemplo.', true, 1),
  ('Segundo post', 'Contenido del segundo post de ejemplo.', false, 1),
  ('Post de María', 'Post escrito por María López.', true, 2);
