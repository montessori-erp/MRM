import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    itemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Inventory', 
      required: true 
    },
    itemName: String,
    quantity: { 
      type: Number, 
      required: true 
    }
  }],
  department: { 
    type: String, 
    default: 'Kitchen' 
  },
  orderedBy: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;