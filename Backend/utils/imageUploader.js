import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder,
        resource_type: "auto",
        type: "upload", 
    };
    if (height) {
        options.height = height
    }
    if (quality) {
        options.quality = quality
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}

