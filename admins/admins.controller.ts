import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { AdminsService } from './admins.service';
import { AdminDto } from './dto/admins.dto';

@ApiTags('Admin')
@Controller({ path: 'admin' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() admin: AdminDto) {
    return this.adminsService.create(admin);
  }

  @Get()
  get() {
    return 'hello';
  }
}
