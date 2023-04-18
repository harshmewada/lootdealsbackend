import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import {
  CreatePlatformDto,
  PlatformDto,
  PlatformQueryDto,
  UpdatePlatformDto,
} from './dto/platform.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/utils/multerOptions';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { PaginationQueryDto } from 'src/commondto';

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
    return await this.platformsService.create({
      ...createPlatformDto,
      createdBy: request['user'].name,
      platformImage: getFilePath(file),
    });
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('platformImage', multerOptions(mimeTypes.images)),
  )
  async update(
    @Body() createPlatformDto: UpdatePlatformDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.platformsService.update({
      ...createPlatformDto,
      ...(file && {
        platformImage: getFilePath(file),
      }),
    });
  }

  @Delete()
  async delete(@Body('_id') id: string) {
    return await this.platformsService.deleteOne(id);
  }

  @Get('all')
  async findAll() {
    return await this.platformsService.findAll();
  }
  @Get()
  async find(@Query() data: PlatformQueryDto) {
    return await this.platformsService.find(data);
  }
}
