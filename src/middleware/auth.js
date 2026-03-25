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

const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';

/**
 * Main authentication middleware
 */
export const authMiddleware = async (req, res, next) => {
  let token;

  // Check for token in Headers or Cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('departmentId', 'name');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based access control
 */
export const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission for this action' 
      });
    }
    next();
  };
};

// --- EXPORT ALIASES (Fixes the crashing routes) ---
export const protect = authMiddleware; // Used in inventory, tickets
export const restrictTo = roleCheck;
export const adminOrSuper = roleCheck(['Admin', 'Super-Admin']); // Used in inventory
export const superAdminOnly = roleCheck(['Super-Admin']); // Used in tickets