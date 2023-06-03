import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppErrorService } from './app-error.service';
import { ApiTags } from '@nestjs/swagger';
import { AppErrorDto, AppErrorQueryDto } from './dto/apperror.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('app-error')
@ApiTags('App Error log')
export class AppErrorController {
  constructor(private readonly appErrorService: AppErrorService) {}

  @Public()
  @Post()
  async storeError(@Body() body: AppErrorDto) {
    return await this.appErrorService.storeError(body);
  }

  @Get()
  async findAll(@Query() data: AppErrorQueryDto) {
    return await this.appErrorService.findAll(data);
  }
}
