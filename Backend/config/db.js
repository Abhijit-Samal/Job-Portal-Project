import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected Successfully");
    }
    catch (error){
        console.log("Connection Error", error);
    }
}
