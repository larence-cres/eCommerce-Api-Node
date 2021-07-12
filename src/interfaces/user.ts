import { Document } from 'mongoose';

export interface Address {
    permanent: string,
    temporary: string,
}

export interface IUser extends Document {
    created: Date,
    email: string,
    address: string,
    seller: boolean,
    password: string,
    username: string,
}
