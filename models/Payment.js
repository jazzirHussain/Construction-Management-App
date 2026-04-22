import { Schema, model } from 'mongoose';

// Define the Payment schema
const PaymentSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true
  },
  // scheduleCount: {
  //   type: Number,
  //   required: true
  // },
  // status: {
  //   type: String,
  //   required: true,
  //   enum: ['pending', 'complete'], // Payment status
  //   default: 'pending'
  // },
  createdAt: {
    type: Date,
    default: Date.now
  },
  schedules: [
    {
      amount: {
        type: Number,
        required: true
      },
      dueDate: {
        type: Date,
        required: true
      },
      paidDate: {
        type: Date
      },
      description: String,
      status: {
        type: String,
        required: true,
        enum: ['upcoming', 'paid', 'pending'], // Schedule status
        default: 'upcoming'
      }
    }
  ]
}, {
  versionKey: false, // Disable the `__v` field
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Virtual field to compute 'totalPaid'
PaymentSchema.virtual('totalPaid').get(function() {
  return this.schedules.reduce((total, { amount, status }) => 
    status === 'paid' ? total + amount : total, 0);
});

// Virtual field to compute 'totalAmount'
PaymentSchema.virtual('totalAmount').get(function() {
  return this.schedules.reduce((total, { amount }) => total + amount, 0);
});

// Virtual field to compute 'balanceAmount'
PaymentSchema.virtual('balance').get(function() {
  return this.totalAmount - this.totalPaid;
});

// Virtual field to compute 'isDue'
PaymentSchema.virtual('isDue').get(function() {
  return this.schedules.some(({ dueDate }) => dueDate < Date.now());
});

// Virtual field to compute 'status'
PaymentSchema.virtual('status').get(function() {
  const allPaid = this.schedules.every(({ status }) => status === 'paid');
  return allPaid ? 'complete' : 'pending';
});

PaymentSchema.virtual('scheduleCount').get(function() {
  return this.schedules.length
});
// Virtual field to compute 'counts'
PaymentSchema.virtual('counts').get(function() {
  return this.schedules.reduce((counts, { status, dueDate }) => {
    if (status === 'paid') counts.paid++;
    else if (dueDate < Date.now()) counts.pending++;
    else counts.upcoming++;
    return counts;
  }, { pending: 0, upcoming: 0, paid: 0 });
});

PaymentSchema.pre('find', function() {
  this.sort({ 'schedules.dueDate': 1 });
});

// Ensure virtuals are included when converting documents to JSON
PaymentSchema.set('toJSON', { virtuals: true });
PaymentSchema.set('toObject', { virtuals: true });

// Create the Payment model
const Payment = model('Payment', PaymentSchema);

export default Payment;
