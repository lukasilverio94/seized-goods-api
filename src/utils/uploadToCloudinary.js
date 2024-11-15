import { uploader } from "../config/cloudinary.js";
import fs from "node:fs";

export const uploadImagesToCloudinary = async (files) => {
  const imageUrls = [];

  const uploadPromises = files.map(async (file) => {
    const result = await uploader.upload(file.path);
    imageUrls.push(result.secure_url);

    // remove the local file after upload
    fs.unlinkSync(file.path);
    return result.secure_url;
  });

  await Promise.all(uploadPromises);

  return imageUrls;
};
