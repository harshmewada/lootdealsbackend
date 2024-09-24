import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { ProductTrackingService } from './product-tracking.service';
import {
  AddAmazonProductToTracking,
  GetMyTrackingProducts,
} from './dto/amazon-tracking.dto';

@Controller('tracking')
export class ProductTrackingController {
  constructor(
    private readonly productTrackingService: ProductTrackingService,
  ) {}

  @Post('amazon-product')
  async addProductToTracking(@Body() data: AddAmazonProductToTracking) {
    return await this.productTrackingService.addAmazonProductToTracking({
      ...data,
    });
  }

  @Get('amazon-products')
  async getMyTrackingProducts(@Query() qeury: GetMyTrackingProducts) {
    return await this.productTrackingService.getMyTrackingProducts(qeury);
  }
}
