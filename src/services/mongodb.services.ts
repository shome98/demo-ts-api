import { Model, Document } from "mongoose";

export interface BaseDocument extends Document {
  id: string;
}

export class MongodbService<T extends BaseDocument> {
  protected model: Model<T>;
  protected entityName: string;

  constructor(model: Model<T>, entityName = "Resource") {
    this.model = model;
    this.entityName = entityName;
  }

  async create(data: Omit<T, keyof BaseDocument>): Promise<T> {
    try {
      const document = await this.model.create({ ...data });
      return document;
    } catch (error) {
      throw new Error(
        `Failed to create ${this.entityName}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async findById(id: string): Promise<T> {
    const doc = await this.model.findOne({ _id: id });
    if (!doc) {
      throw new Error(`${this.entityName} with ID ${id} not found`);
    }
    return doc;
  }

  async update(
    id: string,
    data: Partial<Omit<T, keyof BaseDocument>>
  ): Promise<T> {
    const doc = await this.model.findOneAndUpdate(
      { _id: id },
      { $set: data as Record<string, any> },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new Error(`Failed to update ${this.entityName} with ID ${id}.`);
    }
    return doc;
  }

  async delete(id: string): Promise<void> {
    const result = await this.model.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error(`${this.entityName} with ID ${id} not found`);
    }
  }
}
