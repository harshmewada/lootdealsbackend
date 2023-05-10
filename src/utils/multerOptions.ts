import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { mimeTypes } from './fileOptions';
declare type CallBackTypefileFilter = (a: null | Error, b: boolean) => void;
declare type CallBackTypedestination = (a: null, b: string) => void;
const path = process.env.FILE_PATH || join(__dirname, '../../', 'uploads');

// Multer configuration
export const multerConfig = {
  dest: path,
};
console.log('multerConfig', multerConfig);
// Multer upload options
export const multerOptions = (
  mimetype: string | RegExp,
  customFileType?: string,
) => {
  return {
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: CallBackTypefileFilter,
    ) => {
      console.log('file mimte', file.mimetype, file.mimetype.match(mimetype));
      if (mimetype && file.mimetype.match(mimetype)) {
        cb(null, true);
      } else if (
        customFileType &&
        mimeTypes &&
        file.mimetype === customFileType
      ) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            `Unsupported file type ${extname(
              file.originalname,
            )}. Please upload a ${mimetype} file`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },

    // Storage properties
    storage: diskStorage({
      // Destination storage path details
      destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: CallBackTypedestination,
      ) => {
        const uploadPath = multerConfig.dest + '/';
        // Create folder if doesn't exist
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, {
            recursive: true,
          });
        }
        cb(null, uploadPath);
      },
      // File modification details
      filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: CallBackTypedestination,
      ) => {
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
};
