import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auditDate: { type: Date, default: Date.now },
    discrepancies: [
      {
        inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
        itemName: { type: String },
        systemStock: { type: Number },
        physicalStock: { type: Number },
        variance: { type: Number },
        notes: { type: String },
      },
    ],
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Audit', auditSchema);
