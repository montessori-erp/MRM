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

// --- 2. LOGIN (Fixed with Token in Body) ---
export const login = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    // Explicitly select password and populate department
    const user = await User.findOne({ email }).select('+password').populate('departmentId', 'name');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Use the model method to compare
    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    const token = signToken(user._id);
    
    // Set Cookie for extra security
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    
    const u = user.toObject();
    delete u.password;

    // THE FIX: Included 'token' so Frontend LocalStorage can save it
    res.json({ 
      token, 
      user: u, 
      message: 'Logged in successfully' 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- 3. REGISTER (Fixed with Token in Body) ---
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

    // Added token here so user is logged in immediately after registration
    res.status(201).json({ 
      token, 
      user: u, 
      message: 'Registered successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 4. FORGOT PASSWORD ---
// --- 4. FORGOT PASSWORD (SORTED) ---
export const forgotPassword = async (req, res) => {
  let user; // Define outside try to use in catch if needed
  try {
    const email = req.body.email.toLowerCase().trim();
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });

    // Move transporter configuration outside or to a utility to save memory
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Keep this
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });  



    //    const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // Use SSL
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
   
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS, // Ensure this is a 16-char App Password
    //   },
    // });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"DREAM Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1890ff;">Password Reset Request</h2>
          <p>You requested a password reset for your DREAM account. Click the button below to proceed.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background: #1890ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
          <p style="font-size: 0.8em; color: #888;">Note: If the button doesn't work, copy and paste this link: <br/> ${resetURL}</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Token sent to email!' });
  } catch (err) {
    // CRITICAL: If email fails, clear the reset fields so the user can try again fresh
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    
    console.error("Email Error:", err);
    res.status(500).json({ message: 'Error sending email. Please check your App Password.' });
  }
};
// --- 5. RESET PASSWORD (Fixed with Token in Body) ---
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

    // Added token so user doesn't have to log in manually after reset
    res.status(200).json({ 
      token, 
      message: 'Password reset successful' 
    });
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