import mongoose, { Schema, Document } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: false}
});

export const Product = mongoose.model<ProductInterface>('Product', ProductSchema);
