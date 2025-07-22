import User from "../models/user.models.js"
import { uploadImageToCloudinary } from "../utils/imageUploader.js"

export const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user._id;
        const image = req.files?.image;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }

        const uploadedImage = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    image: uploadedImage.secure_url,
                },
            },
            { new: true }
        );
        console.log(updatedUser)

        return res.status(200).json({
            success: true,
            message: "Image updated successfully!",
            image: updatedUser.image
        });
    } catch (err) {
        console.error("Image update error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating image",
        });
    }
};

export const RemoveProfileImage = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    image: null,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Image Removed",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Image update error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating image",
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, email, phone, about, dateOfBirth, gender } = req.body;

        if (!fullName || !email || !phone || !about || !dateOfBirth || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findById(userId).populate("additionalDetails");
        if (!user || !user.additionalDetails) {
            return res.status(404).json({
                success: false,
                message: "User or profile not found",
            });
        }

        user.fullName = fullName;
        user.email = email;
        user.phone = phone;

        user.additionalDetails.gender = gender;
        user.additionalDetails.about = about;
        user.additionalDetails.dateOfBirth = dateOfBirth;

        await user.save();
        await user.additionalDetails.save();

        console.log(user)

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const updateResume = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.files || !req.files.resume) {
            return res.status(400).json({
                success: false,
                message: 'No resume file uploaded',
            });
        }

        const resumeFile = req.files.resume;

        if (resumeFile.mimetype !== 'application/pdf') {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed',
            });
        }

        const resume = await uploadImageToCloudinary(
            resumeFile,
            process.env.FOLDER_NAME
        );

        const user = await User.findById(userId).populate('additionalDetails');
        if (!user || !user.additionalDetails) {
            return res.status(404).json({ success: false, message: 'User or profile not found' });
        }

        user.additionalDetails.resume = resume.secure_url;
        await user.additionalDetails.save();


        user.password= undefined
        res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            user
        });

    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading resume',
        });
    }
};

