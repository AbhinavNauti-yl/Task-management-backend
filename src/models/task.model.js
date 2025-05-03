import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Task = mongoose.model("task", taskSchema)