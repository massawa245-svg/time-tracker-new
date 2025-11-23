import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOvertimeBalance extends Document {
  userId: Types.ObjectId;
  month: string;          // "2024-10"
  year: number;
  monthName: string;      // "Oktober"
  plannedHours: number;   // 160 (20 Tage × 8h)
  actualHours: number;    // 165.5
  overtime: number;       // +5.5
  previousBalance: number; // Übertrag vom Vormonat
  currentBalance: number;  // Aktueller Stand
  days: {
    date: Date;
    planned: number;
    actual: number;
    overtime: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OvertimeBalanceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // "2024-10"
    year: { type: Number, required: true },
    monthName: { type: String, required: true },
    plannedHours: { type: Number, required: true },
    actualHours: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    previousBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    days: [{
      date: { type: Date },
      planned: { type: Number },
      actual: { type: Number },
      overtime: { type: Number }
    }]
  },
  { timestamps: true }
);

// Index für schnelle Abfragen
OvertimeBalanceSchema.index({ userId: 1, month: 1 });

export default mongoose.models.OvertimeBalance || 
  mongoose.model<IOvertimeBalance>('OvertimeBalance', OvertimeBalanceSchema);