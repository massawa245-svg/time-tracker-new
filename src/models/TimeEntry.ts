import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeEntry extends Document {
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  date: string;
  status: 'running' | 'stopped';
  createdAt: Date;
  updatedAt: Date;
}

const TimeEntrySchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 0,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    status: {
      type: String,
      enum: ['running', 'stopped'],
      default: 'running',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
TimeEntrySchema.index({ userId: 1, status: 1 });
TimeEntrySchema.index({ userId: 1, date: 1 });

export default mongoose.models.TimeEntry ||
  mongoose.model<ITimeEntry>('TimeEntry', TimeEntrySchema);
