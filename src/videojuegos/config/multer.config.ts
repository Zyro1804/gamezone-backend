
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

const uploadPath = join(process.cwd(), 'uploads', 'videojuegos');

mkdirSync(uploadPath, { recursive: true });

export const videojuegosStorage = diskStorage({
  destination: uploadPath,

  filename: (_req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    const nombre = `${randomUUID()}${extension}`;

    callback(null, nombre);
  },
});
