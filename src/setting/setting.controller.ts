import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { SettingDto } from './dto/setting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'telegramBannerImage', maxCount: 1 },
        { name: 'trackingBannerImage', maxCount: 1 },
      ],
      multerOptions(mimeTypes.images),
    ),
  )
  async update(
    @Body() data: SettingDto,
    @UploadedFiles()
    files: {
      telegramBannerImage?: Express.Multer.File[];
      trackingBannerImage?: Express.Multer.File[];
    },
  ) {
    return await this.settingService.update({
      ...data,
      ...(files.telegramBannerImage && {
        telegramBannerImage: getFilePath(files.telegramBannerImage[0]),
      }),
      ...(files.trackingBannerImage && {
        trackingBannerImage: getFilePath(files.trackingBannerImage[0]),
      }),
    });
  }

  @Get()
  async get() {
    return await this.settingService.get();
  }
}
