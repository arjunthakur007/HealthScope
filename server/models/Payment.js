import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "Consultation Fee",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "unpaid",
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
