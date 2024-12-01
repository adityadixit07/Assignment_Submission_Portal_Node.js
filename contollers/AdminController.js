import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Assignment from "../models/Assignment.js";
import jwt from "jsonwebtoken";

const AdminController = {
  // ccreate a new admin
  createAdmin: async (req, res) => {
    const { name, email, password } = req.body;
    const adminExist = await Admin.findOne({
      email: email,
    });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exist" });
    }

    const admin = new Admin({
      name,
      email,
      password,
    });
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    await admin.save();
    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  },
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isAdminExist = await Admin.findOne({
        email: email,
      });
      if (!isAdminExist) {
        return res.status(400).json({ message: "Admin not found" });
      }
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      req.user = { id: admin._id, role: admin.role };

      res.status(200).json({
        message: "Admin logged in",
        admin: { id: admin._id, name: admin.name, email: admin.email },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // get the tagged assignments
  getTaggedAssignments: async (req, res) => {
    try {
      // Ensure req.user exists and has an id field (admin is authenticated)
      const adminId = req.user?.id;
      if (!adminId) {
        return res.status(401).json({ message: "Admin not authenticated" });
      }

      // Find assignments that are tagged to the current admin (adminId)
      const assignments = await Assignment.find({
        adminsTagged: { $in: [new mongoose.Types.ObjectId(adminId)] },
      });

      if (assignments.length === 0) {
        return res
          .status(404)
          .json({ message: "No assignment is tagged to you" });
      }

      return res.status(200).json({
        message: "All tagged assignments fetched successfully",
        assignments,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // reject particular assignment that is tagged to partcular admin
  rejectAssignment: async (req, res) => {
    try {
      const { id } = req.params; // The assignment ID passed in the URL
      const adminId = req.user?.id; // Ensure that req.user exists and has the id field

      if (!adminId) {
        return res.status(401).json({ message: "Admin not authenticated" });
      }

      // Find the assignment by its ID
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      if (!assignment.adminsTagged.includes(adminId)) {
        return res.status(403).json({
          message: "You are not authorized to reject this assignment",
        });
      }

      // Update the assignment status to "Rejected"
      assignment.status = "Rejected";
      await assignment.save();

      return res.status(200).json({
        message: "Assignment rejected",
        assignment,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  // accept the assignment that is tagged to the particular admin
  approveAssignment: async (req, res) => {
    try {
      const { id } = req.params; // The assignment ID passed in the URL

      const adminId = req.user.id;
      // Find the assignment by its ID
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // Check if the logged-in admin is the one tagged in the assignment
      if (!assignment.adminsTagged.includes(adminId)) {
        return res.status(403).json({
          message: "You are not authorized to accept this assignment",
        });
      }

      // Update the assignment status to "Accepted"
      assignment.status = "Accepted";
      await assignment.save();

      return res.status(200).json({
        message: "Assignment accepted",
        assignment,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // logout admin
  logoutAdmin: async (req, res) => {
    if (!req.cookies.token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  },
};

export default AdminController;
