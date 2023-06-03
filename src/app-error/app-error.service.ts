import { Injectable } from '@nestjs/common';
import { AppErrorDto, AppErrorQueryDto } from './dto/apperror.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AppError } from './schema/apperror.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class AppErrorService {
  constructor(@InjectModel(AppError.name) private appError: Model<AppError>) {}
  async storeError(data: AppErrorDto) {
    return await this.appError.create(data);
  }

  async findAll(Query: AppErrorQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.appError,
      pageQuery: Query,
      findQuery: appErrorQuery(Query),
      populate: [],
    });
  }
}

const appErrorQuery = ({}: AppErrorQueryDto) => {
  return {};
  //  (
  //   categoryName && {
  //     categoryName: { $regex: categoryName, $options: 'i' },
  //   }
  // );
};
