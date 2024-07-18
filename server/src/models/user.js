import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { createTokenForUser } from "../../services/authenicaton.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: "/images/avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    try {
      const user = await this.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Incorrect Password");

      const token = createTokenForUser(user);

      return token;
    } catch (error) {
      console.log("Error in matchPasswordandGenerateToken:", error);
      throw error;
    }
  }
);

export const User = mongoose.model("Users", userSchema);
