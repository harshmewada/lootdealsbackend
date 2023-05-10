import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingDto } from './dto/setting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  async update(@Body() data: SettingDto) {
    return await this.settingService.update(data);
  }

  @Get()
  async get() {
    return await this.settingService.get();
  }
}
