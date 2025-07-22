import JobDetails from "../models/jobDetails.js";
import Job from "../models/Jobs.model.js"
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import User from "../models/user.models.js";
import Applied from "../models/appliedUsers.js";

export const createJob = async (req, res) => {
  try {
    const userId = req.user._id;
    let { jobTitle, jobDescription, jobType, category, experience, salary, location } = req.body;
    let keyResponsibilities = [];

    // Validate keyResponsibilities
    if (req.body.keyResponsibilities) {
      try {
        keyResponsibilities = JSON.parse(req.body.keyResponsibilities);
        if (!Array.isArray(keyResponsibilities) || keyResponsibilities.length === 0) {
          return res.status(400).json({
            success: false,
            message: "At least one responsibility is required.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid responsibilities format",
        });
      }
    }

    const Status = "Draft";
    const thumbnail = req?.files?.image;

    // Basic validation
    if (!jobTitle || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job title and description are required!"
      });
    }

    // Upload image if present
    let jobImage = null;
    if (thumbnail) {
      const uploaded = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
      jobImage = uploaded.secure_url;
    }

    // Create job details first
    const jobDetails = await JobDetails.create({
      jobType,
      category,
      experience,
      salary,
      location,
      image: jobImage,
    });

    // Create the job
    const newJob = await Job.create({
      jobTitle,
      jobDescription,
      keyResponsibilities,
      Details: jobDetails._id,
      createdBy: userId,
      status: Status,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { jobs: newJob._id }
    });

    const populatedJob = await Job.findById(newJob._id)
      .populate("Details")
      .populate("createdBy", "fullName email");

    return res.status(200).json({
      success: true,
      message: "Job Created Successfully.",
      job: populatedJob
    });

  } catch (err) {
    console.error("Create job error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create job.",
      error: err.message
    });
  }
};


export const publish = async (req, res) => {
  try {
    const { jobId } = req.params
    await Job.findByIdAndUpdate(
      {
        _id: jobId
      },
      {
        $set: {
          status: "Published"
        }
      }, { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "Course Published Successfully"
    })
  }
  catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    })
  }
}

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("Details").populate("createdBy").populate({
      path: "appliedUsers",
      populate: {
        path: "user",
        model: "User"
      }
    }).exec()

    return res.status(200).json({
      success: true,
      message: "Jobs Fetched Successfully!",
      jobs
    })
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "error finding jobs"
    })
  }
}

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job Id"
      })
    }

    const job = await Job.findById(jobId).populate("Details").populate("createdBy").exec()

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Cannot find job details"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Job details fetched Successfully",
      job
    })
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: err
    })
  }
}

export const getJobsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes auth middleware sets req.user

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UnAuthenticated User",
      });
    }

    const userJobs = await Job.find({ createdBy: userId })
      .populate("Details") // optional: include job details
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      jobs: userJobs,
    });
  } catch (error) {
    console.error("Error fetching jobs by user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs.",
    });
  }
};

export const applyJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    if (!user || user.role !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply to jobs.",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const resumeLink = user.additionalDetails?.resume;
    if (!resumeLink) {
      return res.status(400).json({
        success: false,
        message: "Resume not found. Please upload a resume before applying.",
      });
    }

    const alreadyApplied = await Applied.findOne({
      user: userId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job.",
      });
    }

    const applied = await Applied.create({
      user: userId,
      job: jobId,
      resumeLink,
    });

    await Job.findByIdAndUpdate(jobId, {
      $push: { appliedUsers: applied._id },
    });

    return res.status(200).json({
      success: true,
      message: "Job applied successfully.",
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message || err,
    });
  }
};


export const getAppliedJobsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Applied.find({ user: userId })
      .populate({
        path: "job",
        populate: {
          path: "Details",
          model: "JobDetails",
        },
      })
      .sort({ createdAt: -1 });

    const jobs = applications.map(app => app.job);

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(400).json({
      success: false,
      message: "Server error while fetching applied jobs",
    });
  }
};

export const updateJobImage = async (req, res) => {
  try {
    const { jobId } = req.params;
    const image = req.files?.image;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Step 1: Find the Job to get the JobDetails ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobDetailsId = job.Details;
    if (!jobDetailsId) {
      return res.status(404).json({
        success: false,
        message: "JobDetails reference missing in Job",
      });
    }

    // Step 2: Upload image to Cloudinary
    const uploadedImage = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    // Step 3: Update the JobDetails image
    const updatedDetails = await JobDetails.findByIdAndUpdate(
      jobDetailsId,
      {
        $set: { image: uploadedImage.secure_url },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image updated successfully!",
      image: updatedDetails.image,
    });
  } catch (err) {
    console.error("Image update error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating image",
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const {
      jobTitle,
      jobDescription,
      status,
      jobType,
      category,
      experience,
      salary,
      location,
    } = req.body;
    console.log(req.body)

    if (
      !jobTitle ||
      !jobDescription ||
      !status ||
      !jobType ||
      !category ||
      !experience ||
      !salary ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Step 1: Update the main Job fields
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        jobTitle,
        jobDescription,
        status,
      },
      { new: true } // return updated document
    ).populate("Details").populate("createdBy");

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Step 2: Update the JobDetails using its ObjectId
    const detailsId = updatedJob.Details?._id;

    if (!detailsId) {
      return res.status(404).json({
        success: false,
        message: "Job details not found",
      });
    }

    const updatedDetails = await JobDetails.findByIdAndUpdate(
      detailsId,
      {
        jobType,
        category,
        experience,
        salary,
        location,
      },
      { new: true }
    );

    updatedJob.Details = updatedDetails;

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




export const getAppliedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate({
        path: "appliedUsers",
        populate: {
          path: "user",
          select: "fullName email phone role additionalDetails",
          populate: {
            path: "additionalDetails",
            select: "resume",
          }
        }
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      candidates: job.appliedUsers,
    });

  } catch (err) {
    console.error("Error fetching applied candidates:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
