import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CategoryQueryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multerOptions';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { Request } from 'express';

@ApiTags('categorys')
@Controller('category')
export class CategoryController {
  constructor(private readonly categorysService: CategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('categoryImage', multerOptions(mimeTypes.images)),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.categorysService.create({
      ...createCategoryDto,
      createdBy: request['user'].name,
      ...(file && {
        categoryImage: getFilePath(file),
      }),
    });
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('categoryImage', multerOptions(mimeTypes.images)),
  )
  async update(
    @Body() createCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('update cat', createCategoryDto);
    return await this.categorysService.update({
      ...createCategoryDto,
      ...(file && {
        categoryImage: getFilePath(file),
      }),
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
