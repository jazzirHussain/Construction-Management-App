import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Timeline schema
const TimelineSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true
  },
  items: [
    {
      status: {
        type: String,
        required: true,
        enum: ['Ongoing', 'Pre', 'Complete'] // Timeline item status
      },
      date: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      }
    }
  ]
}, {
  versionKey: false // Disable the `__v` field
});

TimelineSchema.pre('find', function() {
  this.sort({ 'items.date': 1 });
});


export default mongoose.model('Timeline', TimelineSchema);
