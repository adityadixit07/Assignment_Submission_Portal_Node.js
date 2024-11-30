import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const AdminController = {
  // ccreate a new admin
  createAdmin: async (req, res) => {
    const { name, email, password } = req.body;
    const admin = new Admin({
      name,
      email,
      password,
    });
    await admin.save();
    res.json(admin);
  },
  loginAdmin: async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
  },

  // get the tagged assignments
  getTaggedAssignments: async (req, res) => {
    const taggedAssignments = await Assignment.find({ tagged: true });
    res.json(taggedAssignments);
  },
};

export default AdminController;
