import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import staffRouter from "./routes/staffRoutes.js";
import patientRouter from "./routes/patientRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();

//Allow multiple origins
const allowedOrigins = ["http://localhost:5173"];

//Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

const PORT = process.env.PORT || 4001;

await connectDB();

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/patient", patientRouter );
app.use("/api/payments", paymentRouter );

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop the server");
});
