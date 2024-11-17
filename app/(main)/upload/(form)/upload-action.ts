"use server";

import { uploadToCloudinary } from "@/lib/server/cloudinary/cloudinary";
import { getUser } from "@/lib/server/workos/session";
import { TFileData, TFileResult } from "@/types/server/type-file";
import { dynamicBlurDataUrl } from "@/utils/dynamic-blur-data-url";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";
import PhotoModel from "@/models/photo-model";
import mongooseConnect from "@/lib/server/mongoose/mongoose";

export async function uploadImage(
    formData: FormData,
    filesUpload: TFileResult[]
) {
    try {
        await mongooseConnect();
        const user = await getUser();
        if (!user) {
            return { status: 401, message: "Un Authorization!" };
        }

        const files = formData.getAll("files") as TFileData[];

        // Upload photo to the cloudinary server

        const photos = await uploadToCloudinary(files, user?._id);

        // Generate blur data URL
        const blurDataPromise = photos.map((photo) =>
            dynamicBlurDataUrl(photo.secure_url)
        );
        const blurData = await Promise.all(blurDataPromise);
        const newPhotos = photos.map((photo, index) => ({
            user: user._id,
            public_id: photo.public_id,
            imgUrl: photo.secure_url,
            title: filesUpload[index].title,
            tags: filesUpload[index].tags,
            slug: `${slugify(filesUpload[index].title)}`,
            imgName: `${slugify(filesUpload[index].title)}.${photo.format}`,
            public: filesUpload[index].public,
            blurHash: blurData[index],
        }));

        // Save images to Database
        await PhotoModel.insertMany(newPhotos);
        return { status: 200, message: "Upload successful" };
        revalidatePath("/");
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
