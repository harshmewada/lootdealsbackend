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
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/utils/multerOptions';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { PaginationQueryDto } from 'src/commondto';

@ApiTags('Products')
@Controller('product')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('productImage', multerOptions(mimeTypes.images)),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.ProductsService.create({
      ...createProductDto,
      createdBy: request['user'].name,
      productImage: getFilePath(file),
    });
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('productImage', multerOptions(mimeTypes.images)),
  )
  async update(
    @Body() createProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.ProductsService.update({
      ...createProductDto,
      ...(file && {
        ProductImage: getFilePath(file),
      }),
    });
  }

  @Delete()
  async delete(@Body('_id') id: string) {
    return await this.ProductsService.deleteOne(id);
  }

  @Get()
  async findAll(@Query() data: ProductQueryDto) {
    return await this.ProductsService.findAll(data);
  }
}
