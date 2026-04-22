import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  displayname: {
    type: String,
    trim: true,
    default: function () {
      return this.name;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pre', 'Ongoing', 'Onhold', 'Completed'],
    default: 'Ongoing'
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  budget: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  },
  thumbnail: {
    type: String,
    default: "/assets/images/default_project.png"
  },
  documents: [String],
  designs: [String],
  plans: [String],
  activities: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
  },
  timeline: {
    type: Schema.Types.ObjectId,
    ref: 'Timeline',
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  gallery: {
    type: Schema.Types.ObjectId,
    ref: 'Gallery',
  },
  cameras: [{
    name: String,
    url: {
      type: String,
      validate: {
        validator: function (v) {
          // Regular expression for validating IP address URLs with HTTP/HTTPS
          return /^(https?:\/\/)(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/[^\s]*)?$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false, // Disable the `__v` field
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ProjectSchema.virtual('totalCost').get(function () {
  if (this.populated('payment') && this.payment) {
    return this.payment.schedules.reduce((sum, item) => sum + item.amount, 0);
  }
  return null;
});

// Create the Project model
const Project = model('Project', ProjectSchema);

export default Project;

// {
//   date: Date,
//   imageUrl: String,
//   description: String
// }
