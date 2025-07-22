import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Job from '../models/Jobs.model.js';

dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication Error!",
            })
        }
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token!",
            })
        }
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Validation Failed! Please login again",
        })
    }
}


export const isStudent = async (req, res, next) => {
    try {
        const user_details = req.user

        if (user_details.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized Area!"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Invalid User Role!"
        })
    }
}

export const isRecruiter = async (req, res, next) => {
    try {
        const user = req.user
        if (user.role !== "Recruiter") {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized Area!"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Invalid User Role!"
        })
    }
}

export const isJobOwner = async (req, res, next) => {
    try {
        const { jobId } = req.params
        const userId = req.user._id

        if(!jobId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the jobId"
            })
        }

        const job = await Job.findById( jobId ).populate("createdBy").exec()
        console.log("entered")

        if(!job) {
            return res.status(400).json({
                success:false,
                message:"Job doesn't exist"
            })
        }
        console.log("userid",userId.toString())
        console.log("created by",job.createdBy._id.toString())

        if (userId.toString() !== job.createdBy._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized area!"
            });
        }
        req.job = job;
        next();
    }
    catch(err) {
        return res.status(200).json({
            success:false,
            message: err
        })
    }

}