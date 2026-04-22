import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [{ type: String, required: true }],
}, { _id: false });

const packageSchema = new mongoose.Schema({
  plan: { type: String, required: true },
  price: { type: String, required: true },
  features: [featureSchema],
  // Add additional fields here if necessary, such as description, createdAt, etc.
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

export default Package;
