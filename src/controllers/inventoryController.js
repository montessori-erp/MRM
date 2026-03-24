import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

export const list = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    const items = await Inventory.find(filter).populate('departmentId', 'name').sort({ itemName: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('departmentId', 'name');
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    const populated = await item.populate('departmentId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('departmentId', 'name');
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const belowThreshold = async (req, res) => {
  try {
    const items = await Inventory.find({
      $expr: { $lt: ['$currentQuantity', '$thresholdLevel'] },
    })
      .populate('departmentId', 'name')
      .sort({ currentQuantity: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
