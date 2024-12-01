import Admin from "../models/Admin.js";
import User from "../models/User.js";

export const isUser = (requiredRole) => {
  return (req, res, next) => {
    const user = User.findById(req.user._id);
    if (!user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Access denied, ${requiredRole} role required` });
    }
    next();
  };
};
export const isAdmin = (requiredRole) => {
  return (req, res, next) => {
    const user = Admin.findById(req.user._id);
    if (!user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Access denied, ${requiredRole} role required` });
    }
    next();
  };
};
