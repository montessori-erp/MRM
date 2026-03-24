import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true, sparse: true },
    type: { type: String, enum: ['Service', 'Requisition'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved by Director', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    cost: { type: Number, default: null },
    excelFile: { type: String }, // Specifically for the Excel sheet
    attachments: [{ type: String }], // ADDED: Array to store other file URLs
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

ticketSchema.pre('save', async function (next) {
  if (this.ticketNumber) return next();
  const year = new Date().getFullYear();
  const prefix = `TKT-${year}-`;
  const countForYear = await this.constructor.countDocuments({
    ticketNumber: { $regex: `^${prefix}` },
  });
  const seq = String(countForYear + 1).padStart(4, '0');
  this.ticketNumber = `${prefix}${seq}`;
  next();
});

export default mongoose.model('Ticket', ticketSchema);


