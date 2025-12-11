import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Don't return password by default
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true })

export default mongoose.model<IUser>('User', UserSchema);