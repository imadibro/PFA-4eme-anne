import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Public } from '../common/guards/public-route.decorator';

const ALLOWED_CATEGORIES = [
  'profiles',
  'hotels',
  'chambres',
  'restaurants',
  'guides',
  'agences',
  'transports',
  'circuits',
  'packs'
];

@Controller('uploads')
export class UploadsController {
  @Public()
  @Post(':category')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const category = String(req.params.category);
          if (!ALLOWED_CATEGORIES.includes(category)) {
            return cb(new BadRequestException('Catégorie invalide'), '');
          }
          const dir = join(process.cwd(), 'images', category);
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          cb(null, `${prefix}${extname(file.originalname)}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file format'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 } // 2 MB
    })
  )
  public uploadFile(@Param('category') category: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file provided');
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      url: `/api/uploads/${category}/${file.filename}`
    };
  }

  @Public()
  @Get(':category/:filename')
  public showUploadedImage(
    @Param('category') category: string,
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    if (!ALLOWED_CATEGORIES.includes(category)) {
      throw new BadRequestException('Catégorie invalide');
    }
    return res.sendFile(`${category}/${filename}`, { root: 'images' });
  }
}
