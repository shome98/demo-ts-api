import {
  Model,
  Document,
  FilterQuery,
  SortOrder,
  ProjectionType,
} from "mongoose";

export interface BaseDocument extends Document {
  id: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MongodbService<T extends BaseDocument> {
  protected model: Model<T>;
  protected entityName: string;

  constructor(model: Model<T>, entityName = "Resource") {
    this.model = model;
    this.entityName = entityName;
  }

  async paginate(
    query: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: Record<string, SortOrder> = { createdAt: -1 },
    projection?: ProjectionType<T>
  ): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(query, projection).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
