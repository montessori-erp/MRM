// // import { Router } from 'express';
// // import { body } from 'express-validator';
// // import { login, register, me, logout } from '../controllers/authController.js';
// // import { protect } from '../middleware/auth.js';
// // import { validate } from '../middleware/validate.js';

// // const router = Router();

// // router.post(
// //   '/login',
// //   [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
// //   validate,
// //   login
// // );
// // router.post(
// //   '/register',
// //   [
// //     body('name').trim().notEmpty(),
// //     body('email').isEmail().normalizeEmail(),
// //     body('password').isLength({ min: 6 }),
// //     body('role').isIn(['Staff', 'Admin', 'Super-Admin']),
// //   ],
// //   validate,
// //   register
// // );
// // router.get('/me', protect, me);
// // router.post('/logout', logout);

// // export default router;







// import { Router } from 'express';
// import { body } from 'express-validator';
// import { login, register, me, logout, getRegistrationStatus } from '../controllers/authController.js';
// import { protect } from '../middleware/auth.js';
// import { validate } from '../middleware/validate.js';

// const router = Router();

// // Route to check if Super-Admin exists or Admin limit is reached
// router.get('/registration-status', getRegistrationStatus);

// router.post(
//   '/login',
//   [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
//   validate,
//   login
// );

// router.post(
//   '/register',
//   [
//     body('name').trim().notEmpty(),
//     body('email').isEmail().normalizeEmail(),
//     body('password').isLength({ min: 6 }),
//     body('role').isIn(['Staff', 'Admin', 'Super-Admin']),
//   ],
//   validate,
//   register
// );


// router.post('/forgot-password', forgotPassword); // The logic from previous step
// router.post('/reset-password/:token', resetPassword);

// router.get('/me', protect, me);

// router.post('/logout', logout);

// export default router;











import { Router } from 'express';
import { body } from 'express-validator';
import { 
  login, 
  register, 
  me, 
  logout, 
  getRegistrationStatus, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// --- Public Routes ---

// Check if Super-Admin exists or Admin limit is reached
router.get('/registration-status', getRegistrationStatus);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Staff', 'Admin', 'Super-Admin']),
  ],
  validate,
  register
);

// Password Recovery Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// --- Protected Routes ---

router.get('/me', protect, me);
router.post('/logout', logout);

export default router;



















