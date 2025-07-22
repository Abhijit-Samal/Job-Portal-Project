import express from "express";
import { auth, isJobOwner, isRecruiter, isStudent } from "../middlewares/auth.js";
import { applyJobs, createJob, getAllJobs, getAppliedJobsByUser, getJobById, getJobsByUser, publish, updateJob, updateJobImage } from "../contoller/job.controller.js";

const router = express.Router();

router.post('/createJobs', auth, isRecruiter, createJob)
router.post('/publish/:jobId', auth, isRecruiter, isJobOwner, publish)
router.get('/my-jobs', auth, getJobsByUser)
router.get('/', getAllJobs)
router.get('/getJobsAppliedByUser',auth,isStudent,getAppliedJobsByUser)
router.get('/:jobId', getJobById)
router.post('/apply/:jobId',auth,isStudent,applyJobs)
router.patch('/editJob/:jobId',auth, isRecruiter,updateJob)
router.patch('/:jobId',auth,isRecruiter,updateJobImage)


export default router