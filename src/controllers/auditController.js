import Audit from '../models/Audit.js';

export const list = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const filter = {};
    if (req.user.role === 'Admin' && req.user.departmentId)
      filter.departmentId = req.user.departmentId;
    if (departmentId) filter.departmentId = departmentId;
    const audits = await Audit.find(filter)
      .populate('departmentId', 'name')
      .populate('conductedBy', 'name')
      .sort({ auditDate: -1 });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id)
      .populate('departmentId', 'name')
      .populate('conductedBy', 'name')
      .populate('discrepancies.inventoryId', 'itemName');
    if (!audit) return res.status(404).json({ message: 'Audit not found' });
    res.json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const audit = await Audit.create({
      ...req.body,
      conductedBy: req.user._id,
    });
    const populated = await audit
      .populate('departmentId', 'name')
      .populate('conductedBy', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
