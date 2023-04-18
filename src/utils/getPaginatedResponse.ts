import { ModelDefinition } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/commondto';

interface Populate {
  path: string;
  model: string;
  populate?: Populate[];
}

interface RequestQuery<T, B> {
  model: Model<T>;
  findQuery?: B;
  pageQuery: PaginationQueryDto;
  populate?: Populate[];
}

export const getPaginatedResponse = async <Type, QueryType>({
  model,
  pageQuery,
  findQuery,
  populate = [],
}: RequestQuery<Type, QueryType>) => {
  //   console.log('getPaginatedResponse', model, pageQuery, populate, findQuery);
  const pageSize = pageQuery.pageSize ? parseInt(pageQuery.pageSize) : 10;
  let returnData = {
    data: [],
    hasNext: false,
    hasPrevious: false,
    page: pageQuery.page,
    pageSize: pageSize,
    totalCount: undefined,
  };
  if (pageQuery.page) {
    returnData.data = await model
      .find(findQuery)
      .skip(parseInt(pageQuery.page) * pageSize)
      .limit(pageSize)
      .populate(populate);
  }

  //   console.log('count', returnData.data.length, pageQuery.page, pageSize);
  returnData.totalCount = await model.countDocuments();

  return returnData;
};
