import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';

// 1. Kitchen Staff creates the order
export const createOrder = async (req, res) => {
  try {
    const { items, orderedBy } = req.body;
    const newOrder = new Order({ 
      items, 
      orderedBy, 
      department: 'Kitchen', 
      status: 'Pending' 
    });
    await newOrder.save();
    res.status(201).json({ message: "Order sent to Admin for approval" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Fetch ALL orders for the current day (Persistent View)
// Renamed to match the Route call or vice-versa. 
// Using 'getPendingOrders' as the name to satisfy your current Route setup.
export const getPendingOrders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({ 
      createdAt: { $gte: today } 
    }).populate('items.itemId');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Admin approves and triggers inventory subtraction
export const approveOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new Error("Order not found");
    if (order.status === 'Approved') throw new Error("Order already processed");

    for (const item of order.items) {
      await Inventory.findByIdAndUpdate(
        item.itemId,
        { $inc: { currentQuantity: -item.quantity } }, 
        { session, new: true }
      );
    }

    order.status = 'Approved';
    await order.save({ session });

    await session.commitTransaction();
    res.json({ message: "Approved and Inventory Updated" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};











