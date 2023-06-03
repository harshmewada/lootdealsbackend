import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { ProductQueryDto } from 'src/products/dto/product.dto';
import { AppApisService } from './app-apis.service';
import { AppErrorService } from 'src/app-error/app-error.service';
import { AppErrorDto } from 'src/app-error/dto/apperror.dto';

@Controller('app')
@Public()
export class AppApisController {
  constructor(
    private readonly appApisService: AppApisService,
    private readonly appErrorService: AppErrorService,
  ) {}

  @Get('home')
  async homePage() {
    console.log('home req');
    return this.appApisService.getHomePage();
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
}
