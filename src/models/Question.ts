import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  questionText: string;
  options: string[]; 
  correctOption: string; 
  category?: string; 
}


const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], 
  correctOption: { type: String, required: true, select: false }, // 'select: false' hides answer by default!
  category: { type: String }
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);