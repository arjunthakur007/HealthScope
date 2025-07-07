import Payment from "../models/Payment.js";

// 1. Add a new payment (other charges) for a specific patient; /api/payments
export const addPayment = async (req, res) => {
  try {
    const { patientId, amount, description, status, paymentMethod } = req.body;

    const newPayment = new Payment({
      patient: patientId,
      amount,
      description,
      status: status || "pending",
      paymentMethod: paymentMethod || "unpaid",
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment added successfully.",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to add payment.",
    });
  }
};

// 2. Get all payments for a specific patient: /api/payment/patient/:patientId
export const getPatientPayments = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Find all payments linked to this patient, sorted by creation date
    const payments = await Payment.find({ patient: patientId }).sort({
      createdAt: 1,
    });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching patient payments:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to fetch payments.",
    });
  }
};



// 3. Update an existing payment's status or method: /api/payments/:paymentId
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, paymentMethod } = req.body;

    if (status && !["pending", "paid", "refunded"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status provided." });
    }
     

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update." });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPayment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found." });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully.",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to update payment status.",
    });
  }
};
