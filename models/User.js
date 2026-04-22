import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs'
import hashPassword from '../utils/HashPassword.js';
import { ROLE_ADMIN, ROLE_CLIENT, ROLE_SUPER } from '../constants.js';

const userSchema = new Schema({
  username:{
    type: String, 
    required: true 
  },
  email:{
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // match: [/^\d{10}$/, 'Please fill a valid mobile number']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role:{
    type: String,
    enum: [ROLE_ADMIN, ROLE_CLIENT, ROLE_SUPER],
    default: 'client',
    required: true
  },
  profileImage: {
    type: String,
    default: "/assets/images/default.png"
  },
  resetToken: String,
  resetExpires: Date,
  status: {
    type: String,
    default: "active",
    enum: ["active", "deleted"]
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
}, {
  versionKey: false // Disable the `__v` field
})

userSchema.pre('save', async function(next) {
  const user = this;

  // If the password hasn't been modified, move to the next middleware
  if (!user.isModified('password')) return next();

  try {
    user.password = await hashPassword(user.password)
    next(); // Proceed with saving the user
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User