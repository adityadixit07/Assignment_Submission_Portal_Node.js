import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Assignment from "../models/Assignment.js";

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

    await admin.save();
    res.json(admin);
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
      // check if the password is correct
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      res.status(200).json({
        message: "Admin logged in",
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // get the tagged assignments
  getTaggedAssignments: async (req, res) => {
    try {
      // get all tagged assignment to the particuar tagged admin
      // we have admin
      const admin = await Admin.findById(req.user._id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const assignments = await Assignment.find({
        adminsTagged: { $in: [admin._id] },
      });
      return res.status(200).json({
        message: "All tagged assignments fetched successfully",
        assignments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // rejcet particular assignment that is tagged to partcular admin
  rejectAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      // now we can rejcet the asssingment and save it
      assignment.status = "Rejected";
      await assignment.save();
      return res.status(200).json({
        message: "Assignment rejected",
        assignment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // accept the assignment that is tagged to the particular admin
  approveAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      // now we can accept the assignment and save it
      assignment.status = "Accepted";
      await assignment.save();
      return res.status(200).json({
        message: "Assignment accepted",
        assignment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default AdminController;
