import User from '../models/User.js';

export const list = async (req, res) => {
  try {
    const { departmentId, role } = req.query;
    const filter = { isActive: true };
    if (departmentId) filter.departmentId = departmentId;
    if (role) filter.role = role;
    if (req.user.role === 'Admin' && req.user.departmentId)
      filter.departmentId = req.user.departmentId;
    const users = await User.find(filter)
      .select('-password')
      .populate('departmentId', 'name')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listAdmins = async (req, res) => {
  try {
    const users = await User.find({ role: 'Admin', isActive: true })
      .select('-password')
      .populate('departmentId', 'name')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deactivate = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
