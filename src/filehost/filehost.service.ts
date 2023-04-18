import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilehostService {
  findAll(url: string) {
    try {
      const filePath = join(process.cwd(), 'uploads', url);
      const isExist = existsSync(filePath);
      if (!isExist) {
        throw new NotFoundException('File not found');
      }
      const file = createReadStream(filePath);
      return file;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
