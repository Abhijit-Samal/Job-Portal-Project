import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },

  Details: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "JobDetails"
  },

  keyResponsibilities: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appliedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applied"
    }
  ],
  status: {
    type: String,
    enum: ["Draft", "Published"]
  }
}, {
  timestamps: true,
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
