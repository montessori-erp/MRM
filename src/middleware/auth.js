// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';

// export const protect = async (req, res, next) => {
//   const token = req.cookies?.[COOKIE_NAME] || req.headers?.authorization?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password').populate('departmentId', 'name');
//     if (!user) return res.status(401).json({ message: 'User not found' });
//     if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// export const restrictTo = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({ message: 'You do not have permission for this action' });
//   }
//   next();
// };

// export const adminOrSuper = restrictTo('Admin', 'Super-Admin');
// export const superAdminOnly = restrictTo('Super-Admin');


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  let token;

  // Check header for 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Re-add these exports so your routes don't crash
export const protect = authMiddleware;
export const adminOrSuper = (req, res, next) => {
  if (req.user && ['Admin', 'Super-Admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};