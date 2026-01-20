import mongoose, { Document, Schema } from 'mongoose';

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'

}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    password: string;
    phoneNumber?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Don't return password by default
    gender : {type: String, enum: Object.values(Gender), required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true ,

    toJSON: {
        transform(doc, ret: any) { // Change ret to 'any' here
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
    
},

)

export default mongoose.model<IUser>('User', UserSchema);