const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Student name must be at least 2 characters long'],
      maxlength: [60, 'Student name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address (e.g., student@campus.edu)',
      ],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Infrastructure', 'IT', 'Cleanliness', 'Security', 'Other'],
        message: '{VALUE} is not a valid category. Must be Infrastructure, IT, Cleanliness, Security, or Other',
      },
      default: 'Other',
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority. Must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    location: {
      type: String,
      trim: true,
      default: 'Campus Premises',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Open', 'In Progress', 'Resolved', 'Rejected'],
        message: '{VALUE} is not a valid status. Must be Open, In Progress, Resolved, or Rejected',
      },
      default: 'Open',
    },
  },
  {
    timestamps: true, 
    versionKey: false, 
  }
);

complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ title: 'text', studentName: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
