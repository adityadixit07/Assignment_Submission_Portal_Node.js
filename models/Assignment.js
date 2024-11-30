import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adminsTagged: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
