import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// save the user's password in encrypted form
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});
// match the user's password with the encrypted password
userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
