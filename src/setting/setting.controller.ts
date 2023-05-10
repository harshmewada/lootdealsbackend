import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    FileInterceptor('telegramBannerImage', multerOptions(mimeTypes.images)),
  )
  async update(
    @Body() data: SettingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('update', data, file);
    return await this.settingService.update({
      ...data,
      ...(file && {
        telegramBannerImage: getFilePath(file),
      }),
    });
  }

  @Get()
  async get() {
    return await this.settingService.get();
  }
}
