import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Transgender"],
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allows null values if unique is true and email is optional
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },

    speciality: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    recentAppointment: {
      type: Boolean,
      default: true,
    },

    tokenNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

patientSchema.virtual("treatments", { 
  ref: "Treatment", 
  localField: "_id",
  foreignField: "patient",
  justOne: false, 
});

patientSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "patient",
  justOne: false,
});

patientSchema.index({ tokenNumber: 1, appointmentDate: 1 }, { unique: true });
// Create the Patient Model
const Patient =
  mongoose.model.patient || mongoose.model("patient", patientSchema);

export default Patient;
