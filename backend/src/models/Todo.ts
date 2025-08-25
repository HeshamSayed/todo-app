import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<ITodo>('Todo', todoSchema);