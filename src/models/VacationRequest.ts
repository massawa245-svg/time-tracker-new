import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVacationRequest extends Document {
  userId: string; //  Geändert von Types.ObjectId zu string für Demo-User
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'personal' | 'other' | 'unpaid';
  reason: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  daysRequested: number;
  approvedBy?: string; //  Geändert von Types.ObjectId zu string
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VacationRequestSchema: Schema = new Schema(
  {
    userId: {
      type: String, //  Geändert von Schema.Types.ObjectId zu String
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['vacation', 'sick', 'personal', 'other', 'unpaid'],
      default: 'vacation',
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    daysRequested: {
      type: Number,
      required: true,
    },
    approvedBy: {
      type: String, //  Geändert von Schema.Types.ObjectId zu String
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
VacationRequestSchema.index({ userId: 1, status: 1 });
VacationRequestSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.VacationRequest ||
  mongoose.model<IVacationRequest>('VacationRequest', VacationRequestSchema);
