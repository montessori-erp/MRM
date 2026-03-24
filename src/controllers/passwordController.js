import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  try {
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Reset your password here: ${url}`
    });
    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email' });
  }
};