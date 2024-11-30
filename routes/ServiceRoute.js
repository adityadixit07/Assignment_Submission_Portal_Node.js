import express from "express";
import UserController from "../contollers/UserController.js";
import AdminController from "../contollers/AdminController.js";
import authenticate from "../middleware/Authenticate.js";

const router = express.Router();

// user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/admins", UserController.getAllAdmins);
router.post("/upload", authenticate, UserController.uploadAssignment);

// admin
router.post("/admin/regsiter", AdminController.createAdmin);
router.post("/admin/login", AdminController.loginAdmin);
router.get("/assignments", AdminController.getTaggedAssignments);
