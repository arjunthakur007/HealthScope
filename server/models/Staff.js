import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["receptionist", "doctor"], // Define allowed roles
      required: [true, "Role is required"],
      default: "receptionist", // Default role for new registrations, if applicable
    },

    speciality: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Staff = mongoose.models.staff || mongoose.model("Staff", staffSchema); // Use "Staff" (capitalized) for common convention

export default Staff;
