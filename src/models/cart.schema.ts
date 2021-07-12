import * as Mongoose from 'mongoose';
import { IUser } from 'src/interfaces/user';

export const CartSchema = new Mongoose.Schema({
    ownerId: String,
    buyerId: String,
    productId: String,
    name: String,
    size: String,
    color: String,
    image: String,
    price: Number,
    quantity: Number,
    category: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});