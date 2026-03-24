import Department from '../models/Department.js';
import Ticket from '../models/Ticket.js';
import mongoose from 'mongoose';

export const spendingByDepartment = async (req, res) => {
  try {
    const depts = await Department.find().sort({ name: 1 });
    const result = depts.map((d) => ({
      _id: d._id,
      name: d.name,
      budgetAllocated: d.budgetAllocated,
      totalSpent: d.totalSpent,
      remaining: d.budgetAllocated - d.totalSpent,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const totalSpent = async (req, res) => {
  try {
    const agg = await Department.aggregate([{ $group: { _id: null, total: { $sum: '$totalSpent' } } }]);
    res.json({ totalSpent: agg[0]?.total ?? 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const ticketStats = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'Admin' && req.user.departmentId)
      filter.departmentId = req.user.departmentId;
    const stats = await Ticket.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
