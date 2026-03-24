// // import mongoose from 'mongoose';
// // import bcrypt from 'bcryptjs';

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// //     password: { type: String, required: true, minlength: 6, select: false },
// //     role: { type: String, enum: ['Staff', 'Admin', 'Super-Admin'], required: true },
// //     departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
// //     isActive: { type: Boolean, default: true },
// //   },
// //   { timestamps: true }
// // );

// // userSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   this.password = await bcrypt.hash(this.password, 12);
// //   next();
// // });

// // userSchema.methods.comparePassword = function (candidate) {
// //   return bcrypt.compare(candidate, this.password);
// // };

// // export default mongoose.model('User', userSchema);






// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, select: false },
//   role: { 
//     type: String, 
//     enum: ['Staff', 'Admin', 'Super-Admin'], 
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

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
  
//   // Update passwordChangedAt if the password was modified (not on initial creation)
//   if (!this.isNew) {
//     this.passwordChangedAt = Date.now() - 1000;
//   }
//   next();
// });

// // Instance method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
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
    enum: ['Staff', 'Admin', 'Super-Admin', 'Kitchen'], // Added Kitchen if used in your other routes
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
  // ONLY hash the password if it has actually been changed
  if (!this.isModified('password')) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Update passwordChangedAt if the password was modified (not on initial creation)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

// --- 2. INSTANCE METHOD TO COMPARE PASSWORDS ---
// We pass userPassword as the second argument to ensure it works even if 'select: false' is active
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword || this.password);
};

const User = mongoose.model('User', userSchema);
export default User;