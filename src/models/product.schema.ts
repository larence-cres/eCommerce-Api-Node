import * as Mongoose from 'mongoose';

export const ProductSchema = new Mongoose.Schema({
    ownerId: String,
    name: String,
    image: [{
        type: String
    }],
    description: String,
    price: Number,
    category: String,
    addedToCart: {
        type: Boolean,
        default: false
    },
    color: [{
        type: String
    }],
    size: [{
        type: String
    }],
    orderQuantity: {
        type: Number,
        default: 0
    },
    availableQuantity: {
        type: Number,
        default: 0
    },
    soldQuantity: {
        type: Number,
        default: 0
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});