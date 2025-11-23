import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWorkSchedule extends Document {
  userId: Types.ObjectId | string;
  date: Date;
  plannedStart: string;
  plannedEnd: string;
  plannedHours: number;
  actualStart?: Date;
  actualEnd?: Date;
  actualHours?: number;
  breaks: {
    start: Date;
    end: Date;
    duration: number;
  }[];
  overtime: number;
  status: 'planned' | 'in-progress' | 'completed' | 'break' | 'absent';
  
  // NEUE FELDER für intelligente Berechnungen
  breakMinutes: number;
  autoBreak: boolean;
  efficiency: number;
  
  // Wochenplan Felder
  weeklyPlan?: {
    monday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    tuesday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    wednesday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    thursday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    friday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    saturday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
    sunday: { start: string; end: string; pause: number; hours: number; enabled: boolean };
  };
  isWeeklyPlan: boolean;
  planPublished: boolean;
  publishedBy?: Types.ObjectId | string;
  publishedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const WorkScheduleSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.Mixed,
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    plannedStart: { 
      type: String, 
      required: true,
      default: '09:00'
    },
    plannedEnd: { 
      type: String, 
      required: true,
      default: '17:00'
    },
    plannedHours: { 
      type: Number, 
      required: true,
      default: 8
    },
    actualStart: { 
      type: Date 
    },
    actualEnd: { 
      type: Date 
    },
    actualHours: { 
      type: Number 
    },
    breaks: [{
      start: { type: Date },
      end: { type: Date },
      duration: { type: Number }
    }],
    overtime: { 
      type: Number, 
      default: 0 
    },
    status: { 
      type: String, 
      enum: ['planned', 'in-progress', 'completed', 'break', 'absent'],
      default: 'planned'
    },
    
    // NEUE FELDER für intelligente Berechnungen
    breakMinutes: { 
      type: Number, 
      default: 0 
    },
    autoBreak: {
      type: Boolean,
      default: false
    },
    efficiency: { 
      type: Number 
    },
    
    // Wochenplan Felder
    weeklyPlan: {
      monday: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '16:00' },
        pause: { type: Number, default: 45 },
        hours: { type: Number, default: 8.25 },
        enabled: { type: Boolean, default: true }
      },
      tuesday: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '16:00' },
        pause: { type: Number, default: 45 },
        hours: { type: Number, default: 8.25 },
        enabled: { type: Boolean, default: true }
      },
      wednesday: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '16:00' },
        pause: { type: Number, default: 45 },
        hours: { type: Number, default: 8.25 },
        enabled: { type: Boolean, default: true }
      },
      thursday: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '16:00' },
        pause: { type: Number, default: 45 },
        hours: { type: Number, default: 8.25 },
        enabled: { type: Boolean, default: true }
      },
      friday: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '16:00' },
        pause: { type: Number, default: 45 },
        hours: { type: Number, default: 8.25 },
        enabled: { type: Boolean, default: true }
      },
      saturday: {
        start: { type: String, default: '00:00' },
        end: { type: String, default: '00:00' },
        pause: { type: Number, default: 0 },
        hours: { type: Number, default: 0 },
        enabled: { type: Boolean, default: false }
      },
      sunday: {
        start: { type: String, default: '00:00' },
        end: { type: String, default: '00:00' },
        pause: { type: Number, default: 0 },
        hours: { type: Number, default: 0 },
        enabled: { type: Boolean, default: false }
      }
    },
    isWeeklyPlan: {
      type: Boolean,
      default: false
    },
    planPublished: {
      type: Boolean,
      default: false
    },
    publishedBy: {
      type: Schema.Types.Mixed,
      ref: 'User'
    },
    publishedAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Index für schnelle Abfragen
WorkScheduleSchema.index({ userId: 1, date: 1 });
WorkScheduleSchema.index({ isWeeklyPlan: 1 });
WorkScheduleSchema.index({ planPublished: 1 });

export default mongoose.models.WorkSchedule || 
  mongoose.model<IWorkSchedule>('WorkSchedule', WorkScheduleSchema);