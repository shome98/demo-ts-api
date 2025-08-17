import {
  Model,
  Document,
  Types,
  FilterQuery,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
} from "mongoose";

export interface BaseDocument extends Document {
  id: string;
}

export class MongodbManyService<T extends BaseDocument> {
  protected model: Model<T>;
  protected entityName: string;

  constructor(model: Model<T>, entityName = "Resource") {
    this.model = model;
    this.entityName = entityName;
  }

  async updateManyById(
    ids: string[],
    data: Array<Partial<Omit<T, keyof BaseDocument>>>
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    if (ids.length !== data.length) {
      throw new Error(
        `Ids and object count mismatch. Ids are ${ids.length} objects are ${data.length}`
      );
    }

    const operations = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: data[index] },
        runValidators: true,
      },
    }));

    const result = await this.model.bulkWrite(operations);
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  //insert operations
  async insertMany(docs: Array<Omit<T, keyof BaseDocument>>): Promise<T[]> {
    try {
      const docsToInsert = docs.map((doc) => ({
        ...doc,
      }));
      const insertedDocs = await this.model.insertMany(docsToInsert, {
        lean: true,
      });
      return insertedDocs as T[];
    } catch (error: any) {
      throw new Error(
        `Failed to create ${this.entityName}s : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
