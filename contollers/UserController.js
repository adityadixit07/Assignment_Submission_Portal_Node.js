import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Admin from "../models/Admin.js";

const UserController = {
  // register feature
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const errors = {
        name: "",
        email: "",
        password: "",
      };
      if (!name) {
        errors.name = "Name is required";
      }
      if (!email) {
        errors.email = "Email is required";
      }
      if (!password) {
        errors.password = "Password is required";
      }
      if (errors.name || errors.email || errors.password) {
        return res.status(400).json({ errors });
      }
      const user = await User.create({ name, email, password });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
      });

      return res.status(201).json({
        message: `${user.name} registered successfully`,
      });
    } catch (error) {
      return res.staus(500).json({ message: error.message });
    }
  },

  //   login feature
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const errors = {
        email: "",
        password: "",
      };
      if (!email) {
        errors.email = "Email is required";
      }
      if (!password) {
        errors.password = "Password is required";
      }
      if (errors.email || errors.password) {
        return res.status(400).json({ errors });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
      });
      return res
        .status(200)
        .json({ message: "Logged in successfully", token: token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //   get all admins
  getAllAdmins: async (req, res, next) => {
    try {
      const admins = await Admin.find();
      return res.status(200).json({
        allAdmins: admins,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  //   upload the json assignment file
  uploadAssignment: async (req, res, next) => {
    try {
      const { title, description, adminsTagged } = req.body;
      const user = req.user;
      const assignment = await Assignment.create({
        title,
        description,
        user: user._id,
        adminsTagged,
      });
      await assignment.save();
      return res
        .status(201)
        .json({ message: "Assignment uploaded successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default UserController;
