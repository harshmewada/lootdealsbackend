import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import {
  CategoryDto,
  CategoryQueryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private category: Model<Category>) {}
  async create(createCategoryDto: CategoryDto) {
    return await this.category.create(createCategoryDto);
  }

  async update(createCategoryDto: UpdateCategoryDto) {
    return await this.category.findByIdAndUpdate(createCategoryDto._id, {
      ...createCategoryDto,
    });
  }

  async deleteOne(id: string) {
    return await this.category.findByIdAndDelete(id);
  }
  async find(Query: CategoryQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.category,
      pageQuery: Query,
      findQuery: categoryQuery(Query),
    });
  }
  async findAll() {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return { data: await this.category.find() };
  }
}

const categoryQuery = ({ categoryName }: CategoryQueryDto) => {
  return (
    categoryName && {
      categoryName: { $regex: categoryName, $options: 'i' },
    }
  );
};
