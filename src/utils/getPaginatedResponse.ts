import { ModelDefinition } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  ObjectId,
  PipelineStage,
  ProjectionFields,
} from 'mongoose';
import { PaginationQueryDto } from 'src/commondto';
class NextPrevQuery {
  _id?: { [key: string]: string };
}
interface Select {
  [_id: string]: number;
}
interface Populate {
  path: string;
  model: string;
  select?: Select;
  populate?: Populate[];
}

class RequestQuery<T, B, C> {
  model: Model<T>;
  pipeLines?: PipelineStage[];
  findQuery: B & NextPrevQuery;
  pageQuery: PaginationQueryDto;
  populate?: Populate[];
  project?: ProjectionFields<C>;
}

export const getCursorPaginatedResult = async (
  model: any,
  query: PaginationQueryDto,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: any,
  paginate = true,
  populates: {
    path: string;
    model: string;
    // populate?: {
    //   path?: string;
    //   model?: string;
    // };
    strictPopulate?: boolean;
  }[] = [],
) => {
  query = query || {};

  let limit = +query.limit || 10;
  if (limit < 1) {
    limit = 10;
  }

  const data = await model
    .find(call(query))
    .populate(populates)
    .sort({ createdAt: -1 })

    .limit(query.limit);

  // , {
  //   sort: { _id: -1 },
  //   limit,
  // })

  let hasNext, hasPrev, lastItem, firstItem;
  if (data.length) {
    lastItem = data[data.length - 1]._id;
    firstItem = data[0]._id;

    // If there is an item with id less than last item (remember, sort is in desc _id), there is a next page
    const q = { _id: undefined };

    q._id = {
      $lt: lastItem,
    };
    const r = await model.findOne(q);
    // console.log('next prod', data.length, r?.productName);
    if (r) {
      hasNext = true;
    }

    q._id = {
      $gt: firstItem,
    };
    hasPrev = !!(await model.findOne(q));
  }

  const totalCount = await model.countDocuments(call(query));

  return {
    data: data,
    next: hasNext ? `${lastItem}` : null,
    hasNext,
    previous: hasPrev ? `${firstItem}` : null,
    hasPrevious: hasPrev,
    totalCount,
  };
};
export const getPagination = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  query: PaginationQueryDto,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: any,
  paginate = true,
  populates: {
    path: string;
    model: string;
    populate?: {
      path?: string;
      model?: string;
    };
    strictPopulate?: boolean;
  }[] = [],
) => {
  if (paginate) {
    const rawQuery = model
      .find(call(query))
      .sort({ _id: -1 })
      .limit(query.limit);
    let result = null;
    if (populates.length) {
      populates.forEach((ele) => rawQuery.populate(ele));
    }
    if (!query.next && !query.previous) {
      result = await generator(query, rawQuery);
    } else {
      result = await rawQuery;
    }
    result = query.previous ? result.reverse() : result;
    const lastElementId = result[result.length - 1]?._id;
    const nextElement = await model.findOne({
      _id: { $gt: result[result.length - 1]?._id },
    });
    console.log('lastElementId', lastElementId, nextElement._id);
    const next = nextElement?._id;
    const previous: ObjectId = query.page == 1 ? null : result[0]?._id;
    delete query.next;
    delete query.previous;
    const totalCount = await model.countDocuments(call(query));

    return {
      data: result,
      next,
      hasNext: Boolean(next),
      previous,
      hasPrevious: Boolean(previous),
      totalCount,
    };
  } else {
    return await model.find(call(query)).sort({ _id: -1 }).limit(query.limit);
  }
};
const generator = (query: any, rawQuery: any) => {
  if (query.page == undefined) {
    query.page = 1;
  }
  if (query.limit == undefined) {
    query.limit = 10;
  }
  if (typeof query.limit == 'string') {
    query['limit'] = parseInt(query.limit);
  }
  let result = rawQuery.skip((query.page - 1) * query.limit);
  return result;
};

export const getPaginatedResponse = async <Type, QueryType, C>({
  model,
  pageQuery,
  findQuery,
  populate = [],
}: RequestQuery<Type, QueryType, C>) => {
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
      .sort({ createdAt: -1 })
      .skip(pageQuery.page * pageSize)
      .limit(pageSize)
      .populate(populate);
  }

  //   console.log('count', returnData.data.length, pageQuery.page, pageSize);
  returnData.totalCount = await model.countDocuments();

  return returnData;
};
export const getAggregatePaginatedResponse = async <Type, QueryType, Prokect>({
  model,
  pageQuery,
  findQuery,
  pipeLines,
  populate = [],
  project,
}: RequestQuery<Type, QueryType, Prokect>) => {
  const pageSize = pageQuery.pageSize ? Number(pageQuery.pageSize) : 10;
  let returnData = {
    data: [] as Omit<HydratedDocument<Type, {}, {}>, never>[],
    hasNext: false,
    hasPrevious: false,
    page: pageQuery.page,
    pageSize: pageSize,
    totalCount: 0,
    next: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
    previous: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
  };

  // Handle pagination based on paginate property and page/next/previous
  if (pageQuery.paginate && !JSON.parse(pageQuery.paginate)) {
    // console.log('pipeLines', pipeLines);
    // Standard Mongoose pagination
    returnData.data = await model.aggregate([
      { $match: findQuery },
      ...(pipeLines ? pipeLines : []),
    ]);
    returnData.totalCount = returnData.data.length;
  } else {
    // Pagination with aggregation pipeline
    let aggregationPipeline: PipelineStage[] = []; // Replace with your aggregation pipeline stages

    // Add filtering stage based on findQuery
    aggregationPipeline.push({ $match: findQuery });

    // Sorting based on createdAt (optional, adjust as needed)
    aggregationPipeline.push({ $sort: { createdAt: -1 } });

    if (pipeLines) {
      aggregationPipeline = aggregationPipeline.concat(pipeLines);
    }
    if (project) {
      aggregationPipeline = aggregationPipeline.concat([{ $project: project }]);
    }

    if (pageQuery.page) {
      aggregationPipeline = aggregationPipeline.concat([
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [
              { $skip: (pageQuery.page - 1) * pageSize },
              { $limit: pageSize },
            ],
          },
        },
      ]);
    } else if (pageQuery.next || pageQuery.previous) {
      let nextId: any, previousId: any;

      if (pageQuery.next) {
        nextId = await model
          .findOne({ _id: pageQuery.next })
          .select({ _id: 1 });
      }

      if (pageQuery.previous) {
        previousId = await model
          .findOne({ _id: pageQuery.previous })
          .select({ _id: 1 });
      }
      console.log('nextId', nextId);

      if (nextId) {
        aggregationPipeline = aggregationPipeline.concat([
          { $match: { _id: { $lt: nextId._id } } },
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              data: [{ $limit: pageSize }],
            },
          },
        ]);
      } else if (previousId) {
        aggregationPipeline = aggregationPipeline.concat([
          { $match: { _id: { $gt: previousId._id } } },
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              data: [{ $limit: pageSize }],
            },
          },
        ]);
      }
    }

    // Execute aggregation with pagination
    const dataFacet = await model.aggregate(aggregationPipeline);

    returnData.data = dataFacet[0]?.data || []; // Access data from facet
    returnData.totalCount = dataFacet[0]?.metadata[0]?.totalCount || 0; // Access count from facet

    // Calculate next and previous based on last element and total count
    if (dataFacet.length > 0 && dataFacet[0].data.length > 0) {
      const lastElementId =
        dataFacet[0].data[dataFacet[0].data.length - 1]?._id;

      if (lastElementId) {
        const nextElement = await model.findOne({
          _id: { $lt: lastElementId },
        });

        const next = nextElement?._id;

        if (next) {
          returnData.hasNext = true;
          returnData.next = lastElementId;
        }
      }

      const previous = dataFacet[0].data[0]?._id;

      if (pageQuery.next && previous) {
        returnData.hasPrevious = true;
        returnData.previous = previous;
      }
    }
  }

  return returnData;
};
