import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', 
      required: true,
      index: true, 
    },
    testGiven: {
      type: String,
      default: "",
      trim: true,
    },
    testResults: {
      type: String,
      default: "",
      trim: true,
    },
    medication: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Treatment = mongoose.model('Treatment', treatmentSchema);

export default Treatment;