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
 * @desc    Main authentication middleware
 * @alias   Previously named 'protect'
 */
export const authMiddleware = async (req, res, next) => {
  // Check for token in Cookies OR Authorization Header
  let token = req.cookies?.[COOKIE_NAME] || req.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB, populate department, and exclude password
    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('departmentId', 'name');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * @desc    Role-based access control
 * @alias   Previously named 'restrictTo'
 * @param   {String[]} roles - Array of allowed roles (e.g., ['Director', 'Super-Admin'])
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

// --- Legacy Helpers (Optional - keep if used elsewhere) ---
export const adminOrSuper = roleCheck(['Admin', 'Super-Admin']);
export const superAdminOnly = roleCheck(['Super-Admin']);


export const protect = authMiddleware; 
export const restrictTo = roleCheck;