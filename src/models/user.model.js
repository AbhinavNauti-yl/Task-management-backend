import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String, required: false}
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function() {
  return jwt.sign(
    {
      _id: this.id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESTOKENKEY,
    {
      expiresIn: process.env.ACCESSTOKENEXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
