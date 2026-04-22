import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Activity schema
const ActivitySchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true
  },
  activities: [
    {
      image: {
        type: String,
        trim: true
      },
      date: {
        type: Date,
        required: true, // Date when the image was added
        default: Date.now
      },
      title: {
        type: String,
        required: true
      },
      description: String
    }
  ]
}, {
  versionKey: false // Disable the `__v` field
});

ActivitySchema.pre('findOne', function() {
  this.sort({ 'activities.date': 1 });
});

export default mongoose.model('Activity', ActivitySchema);
