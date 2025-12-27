import mongoose, {Document , Schema} from 'mongoose';

export interface IResult extends Document {
  user: mongoose.Types.ObjectId;
  score: number;      
  totalQuestions: number;
  timeTaken: number;  
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, 
}, { timestamps: true });

ResultSchema.index({ score: -1, timeTaken: 1 }); 

export default mongoose.model<IResult>('Result', ResultSchema);