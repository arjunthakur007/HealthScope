import express from "express";
import authStaff from "../middleware/authStaff.js";
import {
  addPatient,
  addTreatment,
  changeAppointment,
  deletePatient,
  getPatientTreatments,
  getSinglePatient,
  patientList,
} from "../controllers/PatientControllers.js";

const patientRouter = express.Router();

// //Route  - "/api/patient/add"
//Des    - for adding patients
//Access - Public
//Method - POST
//Params - none
//Body   - none
patientRouter.post("/add", authStaff, addPatient);

//Route  - "/api/patient/list"
//Des    - for getting list of patients
//Access - Public
//Method - POST
//Params - none
//Body   - none
patientRouter.get("/list", patientList);

//Route  - "/api/patient/"
//Des    - Add patient
//Access - Public
//Method - POST
//Params - none
//Body   - none
patientRouter.post("/appointment", authStaff, changeAppointment);

//Route  - "/api/patient/remove"
//Des    - Add patient
//Access - Public
//Method - DELETE
//Params - none
//Body   - none
patientRouter.delete("/remove/:id", deletePatient);

//Route  - "/api/patient/:id"
//Des    - getting individual patient by id
//Access - Public
//Method - GET
//Params - none
//Body   - none
patientRouter.get("/:id", getSinglePatient);

//Route  - "/api/patient/add-treatment/:id"
//Des    - adding the treatment
//Access - Public
//Method - PUT
//Params - none
//Body   - none
patientRouter.post("/treatment/add/:id", addTreatment);

//Route  - "/api/treatment/:id"
//Des    - adding the treatment
//Access - Public
//Method - GET
//Params - none
//Body   - none
patientRouter.get("/treatment/:id", getPatientTreatments);

export default patientRouter;
