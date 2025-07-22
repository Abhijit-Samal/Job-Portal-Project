import express from "express";  
import { auth } from "../middlewares/auth.js"
import { RemoveProfileImage, updateProfile, updateProfileImage, updateResume } from "../contoller/profile.controller.js";

const router = express.Router();

router.patch("/updateProfileImage", auth, updateProfileImage)
router.patch("/removeImage", auth, RemoveProfileImage)
router.patch("/updateProfile", auth, updateProfile)
router.patch("/updateResume", auth, updateResume)


export default router