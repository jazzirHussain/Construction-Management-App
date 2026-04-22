
import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }  // Image URL for each section
});

const BlogPostSchema = new mongoose.Schema({
  // id: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: String, required: true },
  content: [{ type: String, required: true }],  // Content paragraphs as array of strings
  image: { type: String },  // Main image URL
  sections: [SectionSchema]  // Array of sections
});

export default mongoose.model('BlogPost', BlogPostSchema);
