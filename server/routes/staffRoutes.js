import express from "express";
import authStaff from "../middleware/authStaff.js";
import { isAuth, login, logout } from "../controllers/StaffControllers.js";



const staffRouter = express.Router();

// //Route  - "/api/staff/login"
//Des    - for staff registeration
//Access - Public
//Method - POST
//Params - none
//Body   - none
staffRouter.post("/login", login);

// //Route  - "/api/staff/is-auth"
//Des    - for staff authenticaation
//Access - Public
//Method - GET
//Params - none
//Body   - none
staffRouter.get("/is-auth",authStaff, isAuth);

// //Route  - "/api/staff/logout"
//Des    - for staff authenticaation
//Access - Public
//Method - GET
//Params - none
//Body   - none
staffRouter.get("/logout",authStaff, logout);

export default staffRouter;
