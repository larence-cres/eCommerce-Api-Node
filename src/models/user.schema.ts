import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';

export const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        select: false,
    },
    email: {
        type: String,
        unique: true,
        match: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    },
    seller: {
        type: Boolean,
        default: false,
    },
    address: String,
    created: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

UserSchema.pre('save', async function (next: Mongoose.HookNextFunction) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await Bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});