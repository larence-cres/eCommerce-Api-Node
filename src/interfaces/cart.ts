import { Document } from 'mongoose';

export interface ICart extends Document {
    name: string,
    size: string,
    color: string,
    image: string,
    price: string,
    ownerId: string,
    buyerId: string,
    quantity: number,
    category: string,
    productId: string,
}