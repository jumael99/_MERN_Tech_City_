import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the jwt from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.status(401);
      throw new Error("Not Authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

// Seller middleware
const seller = (req, res, next) => {
  console.log("User in seller middleware:", req.user);
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a seller");
  }
};

export { protect, admin, seller };
