import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Gallery schema
const GallerySchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true
  },
  images: [
    {
      url: {
        type: String,
        required: true, // Image URL is required
        trim: true
      },
      date: {
        type: Date,
        required: true, // Date when the image was added
        default: Date.now
      }
    }
  ]
}, {
  versionKey: false // Disable the `__v` field
});

GallerySchema.pre('find', function() {
  this.sort({ 'images.date': 1 });
});

export default mongoose.model('Gallery', GallerySchema);
