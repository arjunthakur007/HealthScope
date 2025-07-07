import Staff from "../models/Staff.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register Staff: /api/admin/register
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      speciality,
      password,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !role ||
      !password
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (role === "doctor" && !speciality) {
      return res.status(400).json({
        success: false,
        message: "speciality is required for doctors.",
      });
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.json({
        success: false,
        message:
          "A staff member with this email already exists. Please use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaffData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password: hashedPassword,
    };

    if (role === "doctor") {
      newStaffData.speciality = speciality;
    }

    const staff = await Staff.create(newStaffData);

    const token = jwt.sign(
      { staffId: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true, //prevent javascript from accessing cookie
      secure: process.env.NODE_ENV === "production", //Using secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time in m.s.
    });
    return res.json({
      success: true,
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        speciality: staff.speciality,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


