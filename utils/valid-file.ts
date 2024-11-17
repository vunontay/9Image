import { TFileResult } from "@/types/client/type-file";
import { z } from "zod";

const imgTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 1024 * 1024; // 1 MB

// Schema validation for File object
const fileSchema = z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image"), {
        message: "This is not a valid image",
    })
    .refine((file) => imgTypes.includes(file.type), {
        message: "This image format is incorrect - only png, jpeg, webp",
    })
    .refine((file) => file.size <= maxFileSize, {
        message: "This image size is larger than 1mb",
    });

export const validFiles = (file: unknown): TFileResult => {
    const result = fileSchema.safeParse(file);

    if (!result.success) {
        const message = result.error.errors[0].message;
        return {
            status: "error",
            message,
            title: file instanceof File ? file.name : "Unknown",
            imgUrl: "/placeholder-image.webp",
        };
    }

    return {
        status: "success",
        title: result.data.name.replace(/\.(jpeg|jpg|png|webp)$/gi, ""),
        tags: ["anonymous-example"],
        public: false,
        imgUrl: URL.createObjectURL(result.data),
        fileUpload: result.data,
    };
};
