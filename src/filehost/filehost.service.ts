import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FilehostService {
  findAll(url: string) {
    const filePath = join(process.cwd(), 'uploads', url);
    const file = createReadStream(filePath);
    return file;
  }
}
