import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { ProductQueryDto } from 'src/products/dto/product.dto';
import { AppApisService } from './app-apis.service';
import { AppErrorService } from 'src/app-error/app-error.service';
import { AppErrorDto } from 'src/app-error/dto/apperror.dto';
import { PaginationQueryDto } from 'src/commondto';
import {
  AddAmazonProductToTracking,
  GetMyTrackingProducts,
} from 'src/product-tracking/dto/amazon-tracking.dto';
import { ProductTrackingService } from 'src/product-tracking/product-tracking.service';
import { CateGoryTrackingDto } from 'src/category/dto/category.dto';

@Controller('app')
@Public()
export class AppApisController {
  constructor(
    private readonly appApisService: AppApisService,
    private readonly appErrorService: AppErrorService,
    private readonly productTrackingService: ProductTrackingService,
  ) {}

  @Get('home')
  async homePage() {
    return this.appApisService.getHomePage();
  }
  @Get('home2')
  async homePage2() {
    return this.appApisService.getHomePageV2();
  }
  @Get('home/allproducts')
  async allProducts(@Query() query: PaginationQueryDto) {
    console.log('allproducts', query);
    // query.pageSize = JSON.stringify(query.limit);
    return this.appApisService.getAllProducts(query);
  }

  @Get('setting')
  async settingData() {
    console.log('home req');
    return this.appApisService.settingData();
  }

  @Get('product')
  async product(@Query('id') id: string) {
    return this.appApisService.getProduct(id);
  }

  @Get('products')
  async getProducts(@Query() query: ProductQueryDto) {
    console.log('product query', query);
    return this.appApisService.getProducts(query);
  }

  @Get('product/increaseViewCount/:id')
  async increaseProductViewCount(@Param('id') id: string) {
    return this.appApisService.increaseProductViewCount(id);
  }

  @Get('categories')
  async getCategories() {
    return this.appApisService.getCategories();
  }

  @Get('offers')
  async getOffers() {
    return this.appApisService.getOffers();
  }

  @Post('app-error')
  async saveAppError(@Body() data: AppErrorDto) {
    return this.appErrorService.storeError(data);
  }

  @Post('registernotificationtoken')
  async registerNotificationToken(@Body('token') token: string) {
    return this.appApisService.registerNotificationToken(token);
  }

  @Post('amazon-product')
  async addProductToTracking(@Body() data: AddAmazonProductToTracking) {
    return await this.productTrackingService.addAmazonProductToTracking({
      ...data,
    });
  }

  @Get('amazon-product')
  async getMyTrackingProducts(@Query() qeury: GetMyTrackingProducts) {
    console.log('query ', qeury);
    return await this.productTrackingService.getMyTrackingProducts(qeury);
  }

  @Delete('amazon-product')
  async removeProductToTracking(@Body() data: AddAmazonProductToTracking) {
    return await this.productTrackingService.removeAmazonProductToTracking({
      ...data,
    });
  }

  @Post('category-tracking')
  async addCategoryToTrack(@Body() data: CateGoryTrackingDto) {
    return await this.productTrackingService.addCategoryToTrack({
      ...data,
    });
  }
}
