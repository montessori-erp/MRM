import Ticket from '../models/Ticket.js';
import Department from '../models/Department.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const list = async (req, res) => {
  try {
    const { departmentId, status, type } = req.query;
    const filter = {};
    if (req.user.role === 'Staff') filter.raisedBy = req.user._id;
    else if (req.user.role === 'Admin' && req.user.departmentId)
      filter.departmentId = req.user.departmentId;

    if (departmentId) filter.departmentId = departmentId;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const tickets = await Ticket.find(filter)
      .populate('departmentId', 'name')
      .populate('raisedBy', 'name email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('departmentId', 'name')
      .populate('raisedBy', 'name email')
      .populate('resolvedBy', 'name');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/ticketController.js

export const create = async (req, res) => {
  try {
    const { type, title, description, departmentId } = req.body;

    let excelFileUrl = null;
    
    // Check if the specific field 'excelFile' exists in req.files
    if (req.files && req.files['excelFile'] && req.files['excelFile'][0]) {
      const file = req.files['excelFile'][0];
      excelFileUrl = await uploadToCloudinary(file.path); 
    }

    const ticket = await Ticket.create({
      ticketNumber: `TKT-${Date.now()}`,
      type,
      title,
      description: description || '',
      departmentId,
      raisedBy: req.user._id,
      excelFile: excelFileUrl,
      status: 'Pending'
    });

    const populated = await Ticket.findById(ticket._id)
      .populate('departmentId', 'name')
      .populate('raisedBy', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error("DETAILED SERVER ERROR:", err); 
    res.status(500).json({ 
      message: err.message || "Internal Server Error during ticket creation",
    });
  }
};

export const approveByDirector = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved by Director' },
      { new: true }
    ).populate('departmentId', 'name').populate('raisedBy', 'name email');
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectByDirector = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', rejectionReason: req.body.rejectionReason || '' },
      { new: true }
    ).populate('departmentId', 'name').populate('raisedBy', 'name email');
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const resolve = async (req, res) => {
//   try {
//     const { cost } = req.body;
//     const ticket = await Ticket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

//     ticket.status = 'Resolved';
//     ticket.cost = cost != null ? Number(cost) : ticket.cost;
//     ticket.resolvedAt = new Date();
//     ticket.resolvedBy = req.user._id;
//     await ticket.save();

//     if (ticket.cost > 0) {
//       await Department.findByIdAndUpdate(ticket.departmentId, {
//         $inc: { totalSpent: ticket.cost },
//       });
//     }

//     const populated = await ticket
//       .populate('departmentId', 'name')
//       .populate('raisedBy', 'name email')
//       .populate('resolvedBy', 'name');
    
//     res.json(populated); // Send JSON back to trigger onSuccess in React
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };







// 21-3-2026






export const resolve = async (req, res) => {
  try {
    const { cost } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Update fields
    ticket.status = 'Resolved';
    ticket.cost = cost != null ? Number(cost) : 0;
    ticket.resolvedAt = new Date();
    ticket.resolvedBy = req.user._id;
    
    await ticket.save();

    // Increment department spending
    if (ticket.cost > 0) {
      await Department.findByIdAndUpdate(ticket.departmentId, {
        $inc: { totalSpent: ticket.cost },
      });
    }

    // Explicitly populate and return the full object
    const populated = await Ticket.findById(ticket._id)
      .populate('departmentId', 'name')
      .populate('raisedBy', 'name email')
      .populate('resolvedBy', 'name');
    
    return res.status(200).json(populated); 
  } catch (err) {
    console.error("Resolve Error:", err);
    res.status(500).json({ message: err.message });
  }
};





