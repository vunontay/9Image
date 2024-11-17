import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { TFileData } from "@/types/server/type-file";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Function to save photos temporarily to the local system's temp directory
export async function savePhotosToLocal(files: TFileData[]): Promise<string[]> {
    const multipleBuffersPromise = files.map(async (file) => {
        // Convert file to buffer
        const data = await file.arrayBuffer();
        const base64String = Buffer.from(data).toString("base64");

        // Return the base64 string with the format you want
        return `data:${file.type};base64,${base64String}`;
    });

    return Promise.all(multipleBuffersPromise); // Return all base64 strings
}

// Function to upload locally saved files to Cloudinary
export async function uploadToCloudinary(
    files: TFileData[],
    userId: string
): Promise<UploadApiResponse[]> {
    const newFiles = await savePhotosToLocal(files);

    const multiplePhotosPromise = newFiles.map((base64) =>
        cloudinary.uploader.upload(base64, {
            folder: `next_image_gallery/${userId}`,
        })
    );

    return await Promise.all(multiplePhotosPromise);
}
