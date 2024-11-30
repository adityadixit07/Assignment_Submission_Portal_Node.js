import dotenv from "dotenv";
dotenv.config();
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (role === "user" && payload.userId)
      req.user = { userId: payload.userId };
    if (role === "admin" && payload.adminId)
      req.user = { adminId: payload.adminId };
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden" });
  }
};

export default authenticate;
