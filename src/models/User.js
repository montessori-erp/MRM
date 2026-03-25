// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, select: false },
//   role: { 
//     type: String, 
//     enum: ['Staff', 'Admin', 'Super-Admin', 'Kitchen'], // Added Kitchen if used in your other routes
//     default: 'Staff' 
//   },
//   departmentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Department' 
//   },
//   isActive: { type: Boolean, default: true },
  
//   // --- Password Reset Fields ---
//   passwordResetToken: String,
//   passwordResetExpires: Date,
//   passwordChangedAt: Date,
// }, { timestamps: true });

// // --- 1. PRE-SAVE MIDDLEWARE ---
// userSchema.pre('save', async function (next) {
//   // ONLY hash the password if it has actually been changed
//   if (!this.isModified('password')) return next();

//   // Hash the password with a cost of 12
//   this.password = await bcrypt.hash(this.password, 12);
  
//   // Update passwordChangedAt if the password was modified (not on initial creation)
//   if (!this.isNew) {
//     this.passwordChangedAt = Date.now() - 1000;
//   }
//   next();
// });

// // --- 2. INSTANCE METHOD TO COMPARE PASSWORDS ---
// // We pass userPassword as the second argument to ensure it works even if 'select: false' is active
// userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
//   return await bcrypt.compare(candidatePassword, userPassword || this.password);
// };

// const User = mongoose.model('User', userSchema);
// export default User;









import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['Staff', 'Admin', 'Super-Admin', 'Kitchen'], 
    default: 'Staff' 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  isActive: { type: Boolean, default: true },
  
  // --- Password Reset Fields ---
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
}, { timestamps: true });

// --- 1. PRE-SAVE MIDDLEWARE ---
userSchema.pre('save', async function (next) {
  // 1. If password isn't modified, skip hashing
  // This allows the forgotPassword function to save reset tokens without re-hashing
  if (!this.isModified('password')) return next();

  // 2. Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  
  // 3. Update passwordChangedAt (important for token validation)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

// --- 2. INSTANCE METHOD TO COMPARE PASSWORDS ---
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  // Using userPassword as backup for cases where select: false is active
  return await bcrypt.compare(candidatePassword, userPassword || this.password);
};

const User = mongoose.model('User', userSchema);
export default User;