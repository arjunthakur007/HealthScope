import express from "express";
import { register } from "../controllers/AdminControllers.js";

const adminRouter = express.Router();

// //Route  - "/api/admin/register"
//Des    - for admin registeration
//Access - Public
//Method - POST
//Params - none
//Body   - none
adminRouter.post("/register", register)

export default adminRouter;
