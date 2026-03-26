import cloudinary from "../config/cloudinary.js";


export const uploadImageToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};


export const uploadMultipleImagesToCloudinary = async (
  files,
  folder = "uploads"
) => {
  const uploads = files.map((file) =>
    uploadImageToCloudinary(file.buffer, folder)
  );
  return Promise.all(uploads);
};
