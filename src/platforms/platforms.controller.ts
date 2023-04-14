import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto, PlatformDto } from './dto/platform.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/utils/multerOptions';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';

@ApiTags('platforms')
@Controller('platform')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('platformImage', multerOptions(mimeTypes.images)),
  )
  async create(
    @Body() createPlatformDto: CreatePlatformDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    console.log('request', request['user']);
    return await this.platformsService.create({
      ...createPlatformDto,
      createdBy: request['user'].name,
      platformImage: getFilePath(file),
    });
  }

  @Get()
  async findAll() {
    console.log('fin req');
    return await this.platformsService.findAll();
  }
}
