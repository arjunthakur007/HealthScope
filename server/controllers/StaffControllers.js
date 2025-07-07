import Staff from "../models/Staff.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Login receptionist: /api/staff/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --- Compare Password ---
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: staff._id, role: staff.role }, // Include 'role' in the payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- Set JWT as HttpOnly Cookie ---
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      staff: {
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Login API - Error caught:", error);

    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred during login. Please try again later.",
    });
  }
};

//Check-auth : /api/staff/is-auth
export const isAuth = async (req, res) => {
  try {
    const staff = req.staff;
    return res.json({ success: true, staff });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Logout user: /api/user/logot

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, //This flag means the cookie cannot be accessed via client-side JavaScript.
      secure: process.env.NODE_ENV === "production", //This flag means the cookie will only be sent over HTTPS (secure) connections.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // This flag controls how cookies are sent with cross-site requests.
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
