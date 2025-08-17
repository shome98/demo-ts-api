import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
} from "mongoose";

export interface BaseDocument extends Document {
  id: string;
}

export class MongodbQueryService<T extends BaseDocument> {
  protected model: Model<T>;
  protected entityName: string;

  constructor(model: Model<T>, entityName = "Resource") {
    this.model = model;
    this.entityName = entityName;
  }

  async updateManyByQuery(
    query: FilterQuery<T>,
    data: UpdateQuery<T>
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const result = await this.model.updateMany(query, data, {
      runValidators: true,
    });
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async deleteManyByQuery(
    query: FilterQuery<T>
  ): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(query);
    return { deletedCount: result.deletedCount };
  }

  async findByQuery(
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T[]> {
    const docs = this.model.find(query, projection, options);
    if (!docs) {
      throw new Error(
        `${this.entityName}s with ${JSON.stringify(query)} not found`
      );
    }
    return docs;
  }

  async findOneByQuery(
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T> {
    const doc = await this.model.findOne(query, projection, options);
    if (!doc) {
      throw new Error(
        `${this.entityName} with ${JSON.stringify(query)} not found`
      );
    }
    return doc as T;
  }

  async checkExistsByQuery(query: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(query);
    return count > 0;
  }

  async countDocumentsByQuery(query: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(query);
  }
}
