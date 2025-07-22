import mongoose from "mongoose";

const jobDetailsSchema = new mongoose.Schema({
  jobType: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  experience: {
    type: String,
    trim: true,
    required: true,
  },
  salary: {
    type: String,
    trim: true,
    required: true,
  },
  location: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type:String,

  }
}, {
  timestamps: true
});

const JobDetails = mongoose.model("JobDetails", jobDetailsSchema);
export default JobDetails;
