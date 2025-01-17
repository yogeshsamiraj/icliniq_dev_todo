import mongoose, { Schema, Document } from 'mongoose';

export interface CartItemInterface {
  productId: string;
  quantity: number;
}

export interface CartInterface extends Document {
  userId: string;
  items: CartItemInterface[];
}

const CartSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export const Cart = mongoose.model<CartInterface>('Cart', CartSchema);
