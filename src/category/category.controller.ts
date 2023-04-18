import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CategoryQueryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categorys')
@Controller('category')
export class CategoryController {
  constructor(private readonly categorysService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
  ) {
    return await this.categorysService.create({
      ...createCategoryDto,
      createdBy: request['user'].name,
    });
  }

  @Patch()
  async update(@Body() createCategoryDto: UpdateCategoryDto) {
    return await this.categorysService.update({
      ...createCategoryDto,
    });
  }

  @Delete()
  async delete(@Body('_id') id: string) {
    return await this.categorysService.deleteOne(id);
  }

  @Get('all')
  async findAll() {
    console.log('all');
    return await this.categorysService.findAll();
  }

  @Get()
  async find(@Query() data: CategoryQueryDto) {
    return await this.categorysService.find(data);
  }
}
