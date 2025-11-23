import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOvertime extends Document {
  userId: Types.ObjectId;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  hours: number;
  type: 'regular' | 'weekend' | 'holiday' | 'night' | 'emergency';
  project: string;
  description: string;
  approved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OvertimeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    },
    hours: {
      type: Number,
      required: true,
      min: [0.1, 'Hours must be at least 0.1']
    },
    type: {
      type: String,
      enum: ['regular', 'weekend', 'holiday', 'night', 'emergency'],
      default: 'regular',
    },
    project: {
      type: String,
      required: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate hours before saving
OvertimeSchema.pre('save', function (next) {
  const start = new Date(`2000-01-01T${this.startTime}`);
  const end = new Date(`2000-01-01T${this.endTime}`);
  
  // Handle overnight overtime (end time next day)
  let timeDiff = end.getTime() - start.getTime();
  if (timeDiff < 0) {
    timeDiff += 24 * 60 * 60 * 1000; // Add 24 hours
  }
  
  this.hours = Math.round((timeDiff / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
  next();
});

export default mongoose.models.Overtime || 
  mongoose.model<IOvertime>('Overtime', OvertimeSchema);