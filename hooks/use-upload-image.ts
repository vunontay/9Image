import { useState, useMemo, useTransition } from "react";
import { TFileResult } from "@/types/client/type-file";
import { uploadImage } from "@/components/photo/upload-action";
import { toast } from "sonner";

const useUploadImages = () => {
    const [files, setFiles] = useState<TFileResult[]>([]);

    const [isPending, startTransition] = useTransition();

    const count = useMemo(() => {
        return files.filter((file) => file.status === "success").length;
    }, [files]);

    // Function to handle image upload
    const handleUploadImages = async () => {
        const filesUpload = files.filter((file) => file.status === "success");

        // Creating FormData to send the files to the backend
        const formData = new FormData();
        filesUpload.forEach((file) => {
            if (file.fileUpload) {
                // Append each valid file to the formData
                formData.append("files", file.fileUpload);

                // If the file doesn't have a title, set it based on its name (removing extension)
                if (!file.title && file.name) {
                    file.title = file.name.replace(
                        /\.(jpeg|jpg|png|webp)$/gi,
                        ""
                    );
                }
            }
        });

        // Prepare a new file array with uploaded files and reset their properties
        const newFiles = filesUpload.map((file) => ({
            ...file,
            fileUpload: "",
            imgUrl: "",
        })) as unknown as TFileResult[];

        startTransition(async () => {
            try {
                // Call the uploadImage function and pass the FormData and newFiles array
                const result = await uploadImage(formData, newFiles);

                // If upload is successful, show success toast and clean up the files
                if (result.status) {
                    toast.success(result.message);
                    // Revoke any temporary object URLs for files that were uploaded
                    files.map((file) =>
                        URL.revokeObjectURL(file.imgUrl as string)
                    );
                    setFiles([]);
                } else {
                    toast.error(result.message || "Failed to upload");
                }
            } catch (error: unknown) {
                const errorMessage =
                    (error as Error).message || "Failed to upload";
                toast.error(errorMessage);
            }
        });
    };

    return {
        files,
        setFiles,
        count,
        isPending,
        handleUploadImages,
    };
};

export default useUploadImages;
