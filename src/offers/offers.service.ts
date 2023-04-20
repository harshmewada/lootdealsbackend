import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/commondto';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { removeFileSync } from 'src/utils/removeFileSync';
import { OfferDto, OfferQueryDto, UpdateOfferDto } from './dto/offer.dto';
import { Offer } from './schema/offers.schema';

@Injectable()
export class OffersService {
  constructor(@InjectModel(Offer.name) private offer: Model<Offer>) {}
  async create(createOfferDto: OfferDto) {
    return await this.offer.create(createOfferDto);
  }

  async update(createOfferDto: UpdateOfferDto) {
    return await this.offer.findByIdAndUpdate(createOfferDto._id, {
      ...createOfferDto,
    });
  }

  async deleteOne(id: string) {
    const deleted = await this.offer.findByIdAndDelete(id);
    removeFileSync(deleted?.offerImage);
    return deleted;
  }
  async find(Query: OfferQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.offer,
      pageQuery: Query,
      findQuery: offerQuery(Query),
    });
  }

  async findAll() {
    const allPlat = await this.offer.find();
    return { data: allPlat };
  }
}

const offerQuery = ({ offerName }: OfferQueryDto) => {
  return (
    offerName && {
      offerName: { $regex: offerName, $options: 'i' },
    }
  );
};
