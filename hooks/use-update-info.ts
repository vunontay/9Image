import { useState, useRef, useTransition } from "react";
import { TFileResult } from "@/types/client/type-file";
import { validFiles } from "@/utils/valid-file";
import { toast } from "sonner";
import { updateUser } from "@/actions/user-action";
import { TUser } from "@/types/client/type-user";

export function useEditUser(data: TUser) {
    const [file, setFile] = useState<TFileResult | undefined>();
    const [name, setName] = useState(data.name);
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    // Handle file upload
    const handleFileUpload = async (filesList: FileList) => {
        const selectedFiles = filesList;
        if (!selectedFiles?.length) return;

        [...selectedFiles].forEach((file) => {
            const result = validFiles(file);
            if (result.status === "error") {
                toast.error(result.message);
            } else {
                setFile(result);
            }
        });

        formRef.current?.reset();
    };

    // Handle drag-and-drop image upload
    const handleDropImage = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = event.dataTransfer;
        handleFileUpload(data.files);
    };

    // Handle updating user information (name and avatar)
    const handleUpdateUser = async () => {
        const formData = new FormData();

        if (file && file.fileUpload) {
            formData.append("files", file.fileUpload);
            URL.revokeObjectURL(file.imgUrl as string);
        }

        startTransition(async () => {
            try {
                const response = await updateUser({
                    formData,
                    name,
                    user: data,
                });

                if (response.status) {
                    toast.success(response.message);
                    setFile(undefined); // Reset the file state after a successful upload
                } else {
                    toast.error(response.message || "Failed to update user");
                }
            } catch (error) {
                toast.error(
                    (error as Error).message || "Failed to update user"
                );
            }
        });
    };

    return {
        file,
        setFile,
        name,
        setName,
        isPending,
        handleFileUpload,
        handleDropImage,
        handleUpdateUser,
        formRef,
    };
}
