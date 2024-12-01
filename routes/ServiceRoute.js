import express from "express";
import UserController from "../contollers/UserController.js";
import AdminController from "../contollers/AdminController.js";
import { verifyToken } from "../utils/Verify.js";
import { isAdmin, isUser } from "../middleware/Authenticate.js";
const router = express.Router();

// user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/admins", verifyToken, isUser("user"), UserController.getAllAdmins);
router.post(
  "/upload",
  verifyToken,
  isUser("user"),
  UserController.uploadAssignment
);

// admin
router.post("/admin/regsiter", AdminController.createAdmin);
router.post("/admin/login", AdminController.loginAdmin);
router.get(
  "/assignments",
  verifyToken,
  isAdmin("admin"),
  AdminController.getTaggedAssignments
);
router.patch(
  "/assignment/:id/reject",
  verifyToken,
  isAdmin("admin"),
  AdminController.rejectAssignment
);
router.patch(
  "/assignment/:id/accept",
  verifyToken,
  isAdmin("admin"),
  AdminController.approveAssignment
);
router.put("/admin/logout", AdminController.logoutAdmin);

export default router;
