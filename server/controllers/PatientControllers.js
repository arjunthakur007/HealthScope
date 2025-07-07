import Counter from "../models/Counter.js";
import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import Payment from "../models/Payment.js";
import Treatment from "../models/Treatment.js";

const CONSULTATION_FEE = 500;

// Add Patient: /api/patient/add
export const addPatient = async (req, res) => {
  try {
    const { name, description, gender, age, email, phoneNumber, speciality } =
      req.body;

    // --- Input Validation ---
    if (
      !name ||
      !description ||
      !gender ||
      !age ||
      !phoneNumber ||
      !speciality
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (Name, Description, Gender, Age, Phone Number, Speciality) must be provided.",
      });
    }
    if (
      isNaN(age) ||
      parseInt(age) <= 0 ||
      !Number.isInteger(parseFloat(age))
    ) {
      return res.status(400).json({
        success: false,
        message: "Age must be a positive whole number.",
      });
    }

    // --- INTEGRATE DAILY RESETTING TOKEN GENERATING SYSTEM HERE ---

    const today = new Date();
    // Set hours/minutes/seconds/milliseconds to 0 to ensure consistency for date comparison
    today.setHours(0, 0, 0, 0);

    // Format date components for the token string (DD/MM/YYYY)
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const todayYYYYMMDD = `${year}-${month}-${day}`;

    const dailyCounterId = `patient_token_seq_${todayYYYYMMDD}`;

    const counter = await Counter.findOneAndUpdate(
      { _id: dailyCounterId },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const sequenceNumFormatted = counter.sequence_value
      .toString()
      .padStart(3, "0");

    const tokenNumber = `${day}/${month}/${year}_${sequenceNumFormatted}`;

    // --- END TOKEN GENERATING SYSTEM ---

    const newPatient = await Patient.create({
      name,
      description,
      gender,
      age: parseInt(age),
      email: email || undefined,
      phoneNumber,
      speciality,
      tokenNumber,
      appointmentDate: today,
      recentAppointment: true,
    });

    // 2. Create a Payment record for the consultation fee
    const newPayment = new Payment({
      patient: newPatient._id,
      amount: CONSULTATION_FEE,
      description: "Consultation Fee",
      status: "pending",
      paymentMethod: "unpaid",
    });
    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Patient and Consultation Fee created successfully.",
      patient: newPatient,
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error adding patient:", error);

    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.tokenNumber &&
      error.keyPattern.appointmentDate
    ) {
      return res.status(409).json({
        success: false,
        message: `A patient with token ${error.keyValue.tokenNumber} for today's date already exists. This is an unexpected conflict, please try again.`,
        error: error.message,
      });
    }
    // --- End specific error handling ---

    res.status(500).json({
      success: false,
      message: "Internal Server Error. Failed to add patient.",
    });
  }
};

//Get Patient List: /api/patient/list
export const patientList = async (req, res) => {
  try {
    const filter = {};
    if (req.query.recentAppointment) {
      filter.recentAppointment = req.query.recentAppointment === "true";
    }
    const patients = await Patient.find(filter);
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Change patient appointment: /api/patient/appointment
export const changeAppointment = async (req, res) => {
  try {
    const { id, recentAppointment } = req.body;
    await Patient.findByIdAndUpdate(id, { recentAppointment });
    res.json({ success: true, message: "Appointment Changed" });
  } catch (error) {
    console.error("Error in changeAppointment API:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

//Delete PAtient: //api/patient/remove/:id
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }
    await Treatment.deleteMany({ patient: id });
    await Payment.deleteMany({ patient: id });

    res.json({ success: true, message: "Patient removed successfully." });
  } catch (error) {
    console.error("Error in deletePatient API:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

//Getting Single Patient byId: /api/patient/:id
export const getSinglePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id).populate("treatments");

    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error("Error in getSinglePatient API:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

//Adding treatment for patient: /api/patient/treatment/add/:id
export const addTreatment = async (req, res) => { 
  try {
    const { id } = req.params; 
    const {testGiven, testResults, medication } = req.body;

    const newTreatment = await Treatment.create({
       patient: id,
      testGiven,
      testResults,
      medication,
      date: new Date(), 
    });

    res.status(201).json({
      success: true,
      message: "Treatment record added successfully.",
      treatment: newTreatment,
    });
  } catch (error) {
    console.error("Error in addTreatment API:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to add treatment record.",
    });
  }
};

//  Get all treatments for a patient: /api/patient/treatment/:id

export const getPatientTreatments = async (req, res) => {
  try {
    const { id } = req.params; 

    const treatments = await Treatment.find({ patient: id }).sort({ date: -1 }); 

    res.status(200).json({ success: true, treatments });
  } catch (error) {
    console.error("Error in getPatientTreatments API:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to fetch treatment history.",
    });
  }
};