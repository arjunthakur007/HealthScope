import express from "express";
import { addPayment, getPatientPayments, updatePaymentStatus } from "../controllers/PaymentControllers.js";


const paymentRouter = express.Router();

// //Route  - "/api/payments/patient/:patientId"
//Des    - for adding patients
//Access - Public
//Method - GET
//Params - none
//Body   - none
paymentRouter.get("/patient/:patientId", getPatientPayments);

// //Route  - "/api/payments/"
//Des    - for adding patients
//Access - Public
//Method - POST
//Params - none
//Body   - none
paymentRouter.post("/", addPayment);

// //Route  - "/api/payments/:paymentId"
//Des    - for adding patients
//Access - Public
//Method - PATCH
//Params - none
//Body   - none
paymentRouter.patch("/:paymentId", updatePaymentStatus); // Use PATCH for partial updates

export default paymentRouter;
