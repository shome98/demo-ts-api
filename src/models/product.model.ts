import { Schema, model, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  id: string; // Virtual
  name: string;
  description: string;
  // Add other fields as needed
}

const ProductSchema = new Schema<IProduct>(
  {
    //id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ProductSchema.pre<IProduct>("save", function (next) {
//   if (this.isNew) {
//     this.id = new Types.ObjectId().toString();
//   }
//   next();
// });
export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  ProductSchema
);
