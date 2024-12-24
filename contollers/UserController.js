import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config();

const UserController = {
  // registeration featur
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const isUserExist = await User.findOne({
        email: email,
      });
      if (isUserExist) {
        return res.status(400).json({ message: "User already exist" });
      }
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
      const token = jwt.sign(
        { id: user._id, role: user.role },
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

      return res.status(201).json({
        message: `${user.name} registered successfully`,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //   login feature
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const isUserExist = await User.findOne({
        email: email,
      });
      if (!isUserExist) {
        return res.status(400).json({ message: "Not registered yet!" });
      }
      const errors = {};

      if (!email) {
        errors.email = "Email is required";
      } else if (!validator.isEmail(email)) {
        errors.email = "Invalid email format";
      }

      if (!password) {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
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
      return res.status(200).json({
        message: "Logged in successfully",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // logout feature
  logout: async (req, res, next) => {
    try {
      res.clearCookie("token");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //   get all admins
  getAllAdmins: async (req, res, next) => {
    try {
      const admins = await Admin.find().select("-password -email");
      return res.status(200).json({
        message: "All admins fetched successfully",
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
      const errors = {};

      if (!title || title.trim() === "") {
        errors.title = "Title is required";
      }

      if (!description || description.trim() === "") {
        errors.description = "Description is required";
      }

      if (
        !adminsTagged ||
        !Array.isArray(adminsTagged) ||
        adminsTagged.length === 0
      ) {
        errors.adminsTagged = "At least one admin must be tagged";
      }

      // Check for validation errors
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      const validAdmins = await Admin.find({ _id: { $in: adminsTagged } });
      if (validAdmins.length !== adminsTagged.length) {
        return res
          .status(400)
          .json({ message: "One or more tagged admins are invalid" });
      }

      // Create assignment
      const assignment = await Assignment.create({
        title: title.trim(),
        description: description.trim(),
        user: user.id,
        adminsTagged,
        status: "Pending",
      });
      await assignment.save();

      return res.status(201).json({
        message: "Assignment uploaded successfully",
        assignment: {
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default UserController;
