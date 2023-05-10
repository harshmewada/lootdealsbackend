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
import { OffersService } from './offers.service';
import { CreateOfferDto, OfferQueryDto, UpdateOfferDto } from './dto/offer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/utils/multerOptions';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { PaginationQueryDto } from 'src/commondto';

@ApiTags('offers')
@Controller('offer')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('offerImage', multerOptions(mimeTypes.images)),
  )
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.offersService.create({
      ...createOfferDto,
      createdBy: request['user'].name,
      ...(file && {
        offerImage: getFilePath(file),
      }),
    });
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('offerImage', multerOptions(mimeTypes.images)),
  )
  async update(
    @Body() createOfferDto: UpdateOfferDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.offersService.update({
      ...createOfferDto,
      ...(file && {
        offerImage: getFilePath(file),
      }),
    });
  }

  @Delete()
  async delete(@Body('_id') id: string) {
    return await this.offersService.deleteOne(id);
  }

  @Get('all')
  async findAll() {
    return await this.offersService.findAll();
  }
  @Get()
  async find(@Query() data: OfferQueryDto) {
    return await this.offersService.find(data);
  }
}
