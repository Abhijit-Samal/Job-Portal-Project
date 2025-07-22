import mongoose from "mongoose";

const appliedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeLink: {
    type: String,
    trim: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  }
}, {
  timestamps: true,
});

const Applied = mongoose.model("Applied", appliedSchema);
export default Applied;
