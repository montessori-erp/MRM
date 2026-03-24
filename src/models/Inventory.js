import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    currentQuantity: { type: Number, required: true, min: 0 },
    thresholdLevel: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, default: 0 },
    unit: { type: String, default: 'pcs' },
  },
  { timestamps: true }
);

inventorySchema.index({ departmentId: 1, itemName: 1 }, { unique: true });

export default mongoose.model('Inventory', inventorySchema);
