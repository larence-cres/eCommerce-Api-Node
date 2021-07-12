import { Document } from 'mongoose';

export interface IProduct extends Document {
    name: string,
    size: string,
    image: string,
    color: string,
    price: number,
    created: Date,
    ownerId: string,
    category: string,
    description: string,
    addedToCart: boolean,
    orderQuantity: number,
    discountPercent: number,
    availableQuantity: number,
}
