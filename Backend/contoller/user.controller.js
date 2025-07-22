import User from "../models/user.models.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import Profile from "../models/profile.models.js";

export const register = async(req,res)=>{
    try{
        const { fullName, password, phone, email, role } = req.body;
        const file = req?.files?.image;
        console.log(req.body)
        console.log("file",file)
        if(!fullName || !password || !phone || !email || !role){
            return res.status(400).json({
                success:false,
                message:"All fields are required !"
            })
        }
        const user = await User.findOne({email})
        if(user) {
            return res.status(409).json({
                success:false,
                message: "User already exists with this email !"
            }) 
        }
        let img;
        if(file){
            img = await uploadImageToCloudinary(
                file,
                process.env.FOLDER_NAME,
                1000,
                1000
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            resume: null,
        })

        const newUser = await User.create({
            fullName,
            password : hashedPassword,
            phone,
            email,
            role,
            image: img?.secure_url,
            additionalDetails: profileDetails._id,
        });

        if(newUser) {
            return res.status(201).json({
                status:true,
                message:"User Created Successfully",
            })
        }

    }
    catch (err) {
        return res.status(400).json({
            error:err.message
        })
    }
}



export const login = async(req,res) => {
    try{
        const { email, password, role } = req.body;

        if(!email || !password || !role) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exist with this email"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }

        if(role !== user.role) {
            return res.status(400).json({
                success:false,
                message:"User not available for this role"
            })
        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {expiresIn: "1d"})

        user.password = undefined;

        res
        .cookie("token", token, {
            httpOnly: true,
            secure: true, // must match logout
            sameSite: "None",                            // must match logout
            path: "/",  
        })
        .status(200)
        .json({
            success: true,
            message: "Login successful",
            user,
        });
    }
    catch(err){
        return res.status(400).json({
            error : err.message
        })
    }
}



export const logout = async (req, res) => {
  try {
    console.log("cookies")
    // First try to clear
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/", // MUST match login
    });

    // Also forcibly overwrite cookie with expired value
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Log out Successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};


export const getCurrentUser = async(req,res) =>{
    try{
        const token = req.cookies?.token;

        console.log("veryfy token", token)

        if(!token)  {
            return res.status(401).json({
                success:false,
                message:"Authentication error! please login agin."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id).populate("additionalDetails").select("-password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            user
        })
    }
    catch(err) {
        return res.status(401).json({
            success:false,
            message: err.message,
        });
    }
}
