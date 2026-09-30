import { BadRequestException } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const IMAGE_MIME_REGEX = /^image\//;

export function imageStorageOptions(subdir: string) {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = join(process.cwd(), 'images', subdir);
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
        cb(null, `${prefix}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (IMAGE_MIME_REGEX.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Unsupported file format'), false);
      }
    },
    limits: { fileSize: 1024 * 1024 * 2 } // 2 MB
  };
}
