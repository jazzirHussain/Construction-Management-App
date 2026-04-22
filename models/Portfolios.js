import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  images: [{ type: String, required: true }], // Array to store multiple image paths
  projectDetails: { type: String, required: true }, // Detailed description of the project
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
