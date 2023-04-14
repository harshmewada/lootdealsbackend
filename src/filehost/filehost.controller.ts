import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { FilehostService } from './filehost.service';
import type { Response } from 'express';
@Public()
@Controller('uploads')
export class FilehostController {
  constructor(private readonly filehostService: FilehostService) {}

  @Get(':url')
  findAll(@Param('url') url: string, @Res() res: Response) {
    const file = this.filehostService.findAll(url);

    return file.pipe(res);
  }
}
