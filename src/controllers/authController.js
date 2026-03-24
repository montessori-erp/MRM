// // // // // import jwt from 'jsonwebtoken';
// // // // // import User from '../models/User.js';

// // // // // const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
// // // // // const COOKIE_OPTS = {
// // // // //   httpOnly: true,
// // // // //   secure: process.env.NODE_ENV === 'production',
// // // // //   sameSite: 'lax',
// // // // //   maxAge: 7 * 24 * 60 * 60 * 1000,
// // // // //   path: '/',
// // // // // };

// // // // // const signToken = (id) =>
// // // // //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // // // // export const login = async (req, res) => {
// // // // //   try {
// // // // //     const { email, password } = req.body;
// // // // //     const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
// // // // //     if (!user || !(await user.comparePassword(password))) {
// // // // //       return res.status(401).json({ message: 'Invalid email or password' });
// // // // //     }
// // // // //     if (!user.isActive) {
// // // // //       return res.status(403).json({ message: 'Account deactivated' });
// // // // //     }
// // // // //     const token = signToken(user._id);
// // // // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
// // // // //     const u = user.toObject();
// // // // //     delete u.password;
// // // // //     res.json({ user: u, message: 'Logged in successfully' });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ message: err.message });
// // // // //   }
// // // // // };

// // // // // export const register = async (req, res) => {
// // // // //   try {
// // // // //     const { name, email, password, role, departmentId } = req.body;
// // // // //     const existing = await User.findOne({ email });
// // // // //     if (existing) return res.status(400).json({ message: 'Email already registered' });
// // // // //     const user = await User.create({ name, email, password, role, departmentId });
// // // // //     const token = signToken(user._id);
// // // // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
// // // // //     const u = user.toObject();
// // // // //     delete u.password;
// // // // //     res.status(201).json({ user: u, message: 'Registered successfully' });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ message: err.message });
// // // // //   }
// // // // // };

// // // // // export const me = async (req, res) => {
// // // // //   res.json({ user: req.user });
// // // // // };

// // // // // export const logout = async (req, res) => {
// // // // //   res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
// // // // //   res.json({ message: 'Logged out' });
// // // // // };





// // // // import jwt from 'jsonwebtoken';
// // // // import User from '../models/User.js';
// // // // import crypto from 'crypto';
// // // // import nodemailer from 'nodemailer';



// // // // const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
// // // // const COOKIE_OPTS = {
// // // //   httpOnly: true,
// // // //   secure: process.env.NODE_ENV === 'production',
// // // //   sameSite: 'lax',
// // // //   maxAge: 7 * 24 * 60 * 60 * 1000,
// // // //   path: '/',
// // // // };

// // // // const signToken = (id) =>
// // // //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // // // /**
// // // //  * HELPER: Checks if Super-Admin exists and if Admin limit is reached
// // // //  * Used by frontend to hide/show registration options
// // // //  */
// // // // export const getRegistrationStatus = async (req, res) => {
// // // //   try {
// // // //     const superAdminExists = await User.exists({ role: 'Super-Admin' });
// // // //     const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
    
// // // //     // Default limit is 5 if not specified in .env
// // // //     const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;

// // // //     res.json({
// // // //       canRegisterSuperAdmin: !superAdminExists,
// // // //       canRegisterAdmin: adminCount < ADMIN_LIMIT,
// // // //     });
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: err.message });
// // // //   }
// // // // };

// // // // export const login = async (req, res) => {
// // // //   try {
// // // //     const { email, password } = req.body;
// // // //     const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
// // // //     if (!user || !(await user.comparePassword(password))) {
// // // //       return res.status(401).json({ message: 'Invalid email or password' });
// // // //     }
    
// // // //     if (!user.isActive) {
// // // //       return res.status(403).json({ message: 'Account deactivated' });
// // // //     }

// // // //     const token = signToken(user._id);
// // // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// // // //     const u = user.toObject();
// // // //     delete u.password;
// // // //     res.json({ user: u, message: 'Logged in successfully' });
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: err.message });
// // // //   }
// // // // };

// // // // export const register = async (req, res) => {
// // // //   try {
// // // //     const { name, email, password, role, departmentId } = req.body;

// // // //     // 1. Role Availability Guardrails
// // // //     if (role === 'Super-Admin') {
// // // //       const exists = await User.exists({ role: 'Super-Admin' });
// // // //       if (exists) return res.status(400).json({ message: 'Super-Admin already exists' });
// // // //     }

// // // //     if (role === 'Admin') {
// // // //       const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
// // // //       const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;
// // // //       if (adminCount >= ADMIN_LIMIT) {
// // // //         return res.status(400).json({ message: 'Admin registration limit reached' });
// // // //       }
// // // //     }

// // // //     // 2. Email Uniqueness Check
// // // //     const existing = await User.findOne({ email });
// // // //     if (existing) return res.status(400).json({ message: 'Email already registered' });

// // // //     // 3. Create User
// // // //     const user = await User.create({ name, email, password, role, departmentId });
    
// // // //     // 4. Set Cookie and Respond
// // // //     const token = signToken(user._id);
// // // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// // // //     const u = user.toObject();
// // // //     delete u.password;
// // // //     res.status(201).json({ user: u, message: 'Registered successfully' });
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: err.message });
// // // //   }
// // // // };

// // // // export const me = async (req, res) => {
// // // //   res.json({ user: req.user });
// // // // };

// // // // export const logout = async (req, res) => {
// // // //   res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
// // // //   res.json({ message: 'Logged out' });
// // // // };











// // // // // --- Forgot Password: Send Email ---
// // // // export const forgotPassword = async (req, res) => {
// // // //   try {
// // // //     const { email } = req.body;
// // // //     const user = await User.findOne({ email });

// // // //     if (!user) {
// // // //       return res.status(404).json({ message: 'No user found with that email address.' });
// // // //     }

// // // //     // 1. Generate a random reset token
// // // //     const resetToken = crypto.randomBytes(32).toString('hex');

// // // //     // 2. Hash it and set expiry (10 minutes)
// // // //     user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// // // //     user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

// // // //     await user.save({ validateBeforeSave: false });

// // // //     // 3. Send it to user's email
// // // //     const transporter = nodemailer.createTransport({
// // // //       service: 'Gmail', // Or your SMTP provider
// // // //       auth: {
// // // //         user: process.env.EMAIL_USER,
// // // //         pass: process.env.EMAIL_PASS, // Use an "App Password" if using Gmail
// // // //       },
// // // //     });

// // // //     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

// // // //     const mailOptions = {
// // // //       from: `DREAM Support <${process.env.EMAIL_USER}>`,
// // // //       to: user.email,
// // // //       subject: 'Password Reset Request (Valid for 10 min)',
// // // //       text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`,
// // // //       html: `<p>Forgot your password? Click the link below to reset it:</p><a href="${resetURL}">${resetURL}</a>`
// // // //     };

// // // //     await transporter.sendMail(mailOptions);

// // // //     res.status(200).json({ message: 'Token sent to email!' });
// // // //   } catch (err) {
// // // //     // Reset fields if email fails
// // // //     const user = await User.findOne({ email: req.body.email });
// // // //     if (user) {
// // // //       user.passwordResetToken = undefined;
// // // //       user.passwordResetExpires = undefined;
// // // //       await user.save({ validateBeforeSave: false });
// // // //     }
// // // //     res.status(500).json({ message: 'There was an error sending the email. Try again later.' });
// // // //   }
// // // // };

// // // // // --- Reset Password: Update DB ---
// // // // export const resetPassword = async (req, res) => {
// // // //   try {
// // // //     // 1. Get user based on the hashed token
// // // //     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

// // // //     const user = await User.findOne({
// // // //       passwordResetToken: hashedToken,
// // // //       passwordResetExpires: { $gt: Date.now() },
// // // //     });

// // // //     // 2. If token has not expired, and there is a user, set the new password
// // // //     if (!user) {
// // // //       return res.status(400).json({ message: 'Token is invalid or has expired' });
// // // //     }

// // // //     user.password = req.body.password;
// // // //     user.passwordResetToken = undefined;
// // // //     user.passwordResetExpires = undefined;
    
// // // //     await user.save();

// // // //     // 3. Log the user in, send JWT
// // // //     const token = signToken(user._id);
// // // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

// // // //     res.status(200).json({ message: 'Password reset successful' });
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: err.message });
// // // //   }
// // // // };



















// // // import jwt from 'jsonwebtoken';
// // // import crypto from 'crypto';
// // // import nodemailer from 'nodemailer';
// // // import User from '../models/User.js';

// // // const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
// // // const COOKIE_OPTS = {
// // //   httpOnly: true,
// // //   secure: process.env.NODE_ENV === 'production',
// // //   sameSite: 'lax',
// // //   maxAge: 7 * 24 * 60 * 60 * 1000,
// // //   path: '/',
// // // };

// // // const signToken = (id) =>
// // //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // // // --- 1. REGISTRATION STATUS CHECK ---
// // // export const getRegistrationStatus = async (req, res) => {
// // //   try {
// // //     const superAdminExists = await User.exists({ role: 'Super-Admin' });
// // //     const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
// // //     const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;

// // //     res.json({
// // //       canRegisterSuperAdmin: !superAdminExists,
// // //       canRegisterAdmin: adminCount < ADMIN_LIMIT,
// // //     });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // --- 2. LOGIN ---
// // // export const login = async (req, res) => {
// // //   try {
// // //     const { email, password } = req.body;
// // //     const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
// // //     if (!user || !(await user.comparePassword(password))) {
// // //       return res.status(401).json({ message: 'Invalid email or password' });
// // //     }
    
// // //     if (!user.isActive) {
// // //       return res.status(403).json({ message: 'Account deactivated' });
// // //     }

// // //     const token = signToken(user._id);
// // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// // //     const u = user.toObject();
// // //     delete u.password;
// // //     res.json({ user: u, message: 'Logged in successfully' });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // --- 3. REGISTER ---
// // // export const register = async (req, res) => {
// // //   try {
// // //     const { name, email, password, role, departmentId } = req.body;

// // //     if (role === 'Super-Admin') {
// // //       const exists = await User.exists({ role: 'Super-Admin' });
// // //       if (exists) return res.status(400).json({ message: 'Super-Admin already exists' });
// // //     }

// // //     if (role === 'Admin') {
// // //       const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
// // //       const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;
// // //       if (adminCount >= ADMIN_LIMIT) {
// // //         return res.status(400).json({ message: 'Admin registration limit reached' });
// // //       }
// // //     }

// // //     const existing = await User.findOne({ email });
// // //     if (existing) return res.status(400).json({ message: 'Email already registered' });

// // //     const user = await User.create({ name, email, password, role, departmentId });
    
// // //     const token = signToken(user._id);
// // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// // //     const u = user.toObject();
// // //     delete u.password;
// // //     res.status(201).json({ user: u, message: 'Registered successfully' });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // --- 4. FORGOT PASSWORD ---
// // // export const forgotPassword = async (req, res) => {
// // //   try {
// // //     const { email } = req.body;
// // //     const user = await User.findOne({ email });

// // //     if (!user) {
// // //       return res.status(404).json({ message: 'No user found with that email address.' });
// // //     }

// // //     const resetToken = crypto.randomBytes(32).toString('hex');
// // //     user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// // //     user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

// // //     await user.save({ validateBeforeSave: false });

// // //     const transporter = nodemailer.createTransport({
// // //       service: 'Gmail',
// // //       auth: {
// // //         user: process.env.EMAIL_USER,
// // //         pass: process.env.EMAIL_PASS,
// // //       },
// // //     });

// // //     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

// // //     await transporter.sendMail({
// // //       from: `DREAM Support <${process.env.EMAIL_USER}>`,
// // //       to: user.email,
// // //       subject: 'Password Reset Request',
// // //       html: `<p>Click the link to reset your password: <a href="${resetURL}">${resetURL}</a></p>`
// // //     });

// // //     res.status(200).json({ message: 'Token sent to email!' });
// // //   } catch (err) {
// // //     res.status(500).json({ message: 'Error sending email. Please try again.' });
// // //   }
// // // };

// // // // --- 5. RESET PASSWORD ---
// // // export const resetPassword = async (req, res) => {
// // //   try {
// // //     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

// // //     const user = await User.findOne({
// // //       passwordResetToken: hashedToken,
// // //       passwordResetExpires: { $gt: Date.now() },
// // //     });

// // //     if (!user) {
// // //       return res.status(400).json({ message: 'Token is invalid or has expired' });
// // //     }

// // //     user.password = req.body.password;
// // //     user.passwordResetToken = undefined;
// // //     user.passwordResetExpires = undefined;
// // //     await user.save();

// // //     const token = signToken(user._id);
// // //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

// // //     res.status(200).json({ message: 'Password reset successful' });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // --- 6. UTILITY METHODS ---
// // // export const me = async (req, res) => {
// // //   res.json({ user: req.user });
// // // };

// // // export const logout = async (req, res) => {
// // //   res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
// // //   res.json({ message: 'Logged out' });
// // // };





















// // import jwt from 'jsonwebtoken';
// // import crypto from 'crypto';
// // import nodemailer from 'nodemailer';
// // import User from '../models/User.js';

// // const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
// // const COOKIE_OPTS = {
// //   httpOnly: true,
// //   secure: process.env.NODE_ENV === 'production',
// //   sameSite: 'lax',
// //   maxAge: 7 * 24 * 60 * 60 * 1000,
// //   path: '/',
// // };

// // const signToken = (id) =>
// //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // // --- 1. REGISTRATION STATUS CHECK ---
// // export const getRegistrationStatus = async (req, res) => {
// //   try {
// //     const superAdminExists = await User.exists({ role: 'Super-Admin' });
// //     const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
// //     const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;

// //     res.json({
// //       canRegisterSuperAdmin: !superAdminExists,
// //       canRegisterAdmin: adminCount < ADMIN_LIMIT,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // --- 2. LOGIN (Updated with Normalization) ---
// // export const login = async (req, res) => {
// //   try {
// //     // 1. Clean the email input (Lowercase and Trim)
// //     const email = req.body.email.toLowerCase().trim();
// //     const { password } = req.body;

// //     // 2. Find user (explicitly selecting password)
// //     const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
// //     // 3. Check if user exists and password is correct
// //     if (!user || !(await user.comparePassword(password))) {
// //       return res.status(401).json({ message: 'Invalid email or password' });
// //     }
    
// //     if (!user.isActive) {
// //       return res.status(403).json({ message: 'Account deactivated' });
// //     }

// //     const token = signToken(user._id);
// //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// //     const u = user.toObject();
// //     delete u.password;
// //     res.json({ user: u, message: 'Logged in successfully' });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // --- 3. REGISTER ---
// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password, role, departmentId } = req.body;

// //     if (role === 'Super-Admin') {
// //       const exists = await User.exists({ role: 'Super-Admin' });
// //       if (exists) return res.status(400).json({ message: 'Super-Admin already exists' });
// //     }

// //     if (role === 'Admin') {
// //       const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
// //       const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;
// //       if (adminCount >= ADMIN_LIMIT) {
// //         return res.status(400).json({ message: 'Admin registration limit reached' });
// //       }
// //     }

// //     const normalizedEmail = email.toLowerCase().trim();
// //     const existing = await User.findOne({ email: normalizedEmail });
// //     if (existing) return res.status(400).json({ message: 'Email already registered' });

// //     const user = await User.create({ name, email: normalizedEmail, password, role, departmentId });
    
// //     const token = signToken(user._id);
// //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
// //     const u = user.toObject();
// //     delete u.password;
// //     res.status(201).json({ user: u, message: 'Registered successfully' });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // --- 4. FORGOT PASSWORD ---
// // export const forgotPassword = async (req, res) => {
// //   try {
// //     const email = req.body.email.toLowerCase().trim();
// //     const user = await User.findOne({ email });

// //     if (!user) {
// //       return res.status(404).json({ message: 'No user found with that email address.' });
// //     }

// //     const resetToken = crypto.randomBytes(32).toString('hex');
// //     user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// //     user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

// //     await user.save({ validateBeforeSave: false });

// //     const transporter = nodemailer.createTransport({
// //       service: 'Gmail',
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

// //     await transporter.sendMail({
// //       from: `DREAM Support <${process.env.EMAIL_USER}>`,
// //       to: user.email,
// //       subject: 'Password Reset Request',
// //       html: `<p>Click the link to reset your password: <a href="${resetURL}">${resetURL}</a></p>`
// //     });

// //     res.status(200).json({ message: 'Token sent to email!' });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error sending email. Please try again.' });
// //   }
// // };

// // // --- 5. RESET PASSWORD ---
// // export const resetPassword = async (req, res) => {
// //   try {
// //     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

// //     const user = await User.findOne({
// //       passwordResetToken: hashedToken,
// //       passwordResetExpires: { $gt: Date.now() },
// //     });

// //     if (!user) {
// //       return res.status(400).json({ message: 'Token is invalid or has expired' });
// //     }

// //     user.password = req.body.password;
// //     user.passwordResetToken = undefined;
// //     user.passwordResetExpires = undefined;
// //     await user.save();

// //     const token = signToken(user._id);
// //     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

// //     res.status(200).json({ message: 'Password reset successful' });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // --- 6. UTILITY METHODS ---
// // export const me = async (req, res) => {
// //   res.json({ user: req.user });
// // };

// // export const logout = async (req, res) => {
// //   res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
// //   res.json({ message: 'Logged out' });
// // };


















// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import nodemailer from 'nodemailer';
// import User from '../models/User.js';

// const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
// const COOKIE_OPTS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'lax',
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   path: '/',
// };

// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // --- 1. REGISTRATION STATUS CHECK ---
// export const getRegistrationStatus = async (req, res) => {
//   try {
//     const superAdminExists = await User.exists({ role: 'Super-Admin' });
//     const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
//     const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;

//     res.json({
//       canRegisterSuperAdmin: !superAdminExists,
//       canRegisterAdmin: adminCount < ADMIN_LIMIT,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // --- 2. LOGIN ---
// export const login = async (req, res) => {
//   try {
//     const email = req.body.email.toLowerCase().trim();
//     const { password } = req.body;

//     // Explicitly select password because of 'select: false' in model
//     const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
//     // Pass both the candidate password and the retrieved hash
//     if (!user || !(await user.comparePassword(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
    
//     if (!user.isActive) {
//       return res.status(403).json({ message: 'Account deactivated' });
//     }

//     const token = signToken(user._id);
//     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
//     const u = user.toObject();
//     delete u.password;
//     res.json({ user: u, message: 'Logged in successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // --- 3. REGISTER ---
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, departmentId } = req.body;

//     if (role === 'Super-Admin') {
//       const exists = await User.exists({ role: 'Super-Admin' });
//       if (exists) return res.status(400).json({ message: 'Super-Admin already exists' });
//     }

//     if (role === 'Admin') {
//       const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
//       const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;
//       if (adminCount >= ADMIN_LIMIT) {
//         return res.status(400).json({ message: 'Admin registration limit reached' });
//       }
//     }

//     const normalizedEmail = email.toLowerCase().trim();
//     const existing = await User.findOne({ email: normalizedEmail });
//     if (existing) return res.status(400).json({ message: 'Email already registered' });

//     const user = await User.create({ name, email: normalizedEmail, password, role, departmentId });
    
//     const token = signToken(user._id);
//     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
//     const u = user.toObject();
//     delete u.password;
//     res.status(201).json({ user: u, message: 'Registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // --- 4. FORGOT PASSWORD ---
// export const forgotPassword = async (req, res) => {
//   try {
//     const email = req.body.email.toLowerCase().trim();
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'No user found with that email address.' });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

//     await user.save({ validateBeforeSave: false });

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     await transporter.sendMail({
//       from: `DREAM Support <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: 'Password Reset Request',
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
//           <h2>Password Reset Request</h2>
//           <p>You requested a password reset. Click the button below to proceed. This link is valid for 10 minutes.</p>
//           <a href="${resetURL}" style="background: #1890ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
//           <p style="margin-top: 20px; font-size: 0.8em; color: #888;">If you didn't request this, please ignore this email.</p>
//         </div>
//       `
//     });

//     res.status(200).json({ message: 'Token sent to email!' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error sending email. Please try again.' });
//   }
// };

// // --- 5. RESET PASSWORD ---
// export const resetPassword = async (req, res) => {
//   try {
//     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() },
//     }).select('+password'); // Select password to ensure middleware/methods have access

//     if (!user) {
//       return res.status(400).json({ message: 'Token is invalid or has expired' });
//     }

//     // Assign new password - userSchema.pre('save') handles the hashing
//     user.password = req.body.password;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
    
//     await user.save();

//     const token = signToken(user._id);
//     res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // --- 6. UTILITY METHODS ---
// export const me = async (req, res) => {
//   res.json({ user: req.user });
// };

// export const logout = async (req, res) => {
//   res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
//   res.json({ message: 'Logged out' });
// };









import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'dream_token';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// --- 1. REGISTRATION STATUS CHECK ---
export const getRegistrationStatus = async (req, res) => {
  try {
    const superAdminExists = await User.exists({ role: 'Super-Admin' });
    const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
    const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;

    res.json({
      canRegisterSuperAdmin: !superAdminExists,
      canRegisterAdmin: adminCount < ADMIN_LIMIT,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 2. LOGIN (Integrated with Debugging) ---
export const login = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    console.log("--- DEBUG START ---");
    console.log("Login Email Attempt:", email);
    console.log("Login Password Attempt:", password);

    // Explicitly select password and populate department
    const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
    if (!user) {
      console.log("❌ Result: User not found in database.");
      console.log("--- DEBUG END ---");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("Stored Hash in DB:", user.password);

    // Use the model method to compare
    const isMatch = await user.comparePassword(password, user.password);
    console.log("Is Match Result:", isMatch);
    console.log("--- DEBUG END ---");

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    const token = signToken(user._id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
    const u = user.toObject();
    delete u.password;
    res.json({ user: u, message: 'Logged in successfully' });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- 3. REGISTER ---
export const register = async (req, res) => {
  try {
    const { name, email, password, role, departmentId } = req.body;

    if (role === 'Super-Admin') {
      const exists = await User.exists({ role: 'Super-Admin' });
      if (exists) return res.status(400).json({ message: 'Super-Admin already exists' });
    }

    if (role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin', isActive: true });
      const ADMIN_LIMIT = parseInt(process.env.ADMIN_LIMIT) || 5;
      if (adminCount >= ADMIN_LIMIT) {
        return res.status(400).json({ message: 'Admin registration limit reached' });
      }
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email: normalizedEmail, password, role, departmentId });
    
    const token = signToken(user._id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
    const u = user.toObject();
    delete u.password;
    res.status(201).json({ user: u, message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 4. FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `DREAM Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to proceed. This link is valid for 10 minutes.</p>
          <a href="${resetURL}" style="background: #1890ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 0.8em; color: #888;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Token sent to email!' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email. Please try again.' });
  }
};

// --- 5. RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    const token = signToken(user._id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 6. UTILITY METHODS ---
export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ message: 'Logged out' });
};



