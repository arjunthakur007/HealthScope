import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

const authStaff = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized (No token provided)" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
   

    const staff = await Staff.findById(tokenDecode.id).select("-password");

    if (!staff) {
      return res.status(401).json({
        success: false,
        message:
          "Not Authorized (Staff member not found or invalid token payload)",
      });
    }

    req.staff = staff;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized (Token expired)" });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized (Invalid token)" });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

export default authStaff;
