"use client";
import { LoadingButton } from "@/components/custom/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TFileResult } from "@/types/client/type-file";
import { TUser } from "@/types/client/type-user";
import { validFiles } from "@/utils/valid-file";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUser } from "@/actions/user-action";
import avatarPlaceholder from "@/assets/avatar-image.webp";
import Image from "next/image";

interface IEditModal {
    isOpen: boolean;
    onClose: () => void;
    data: TUser;
}

const EditModal = ({ isOpen, onClose, data }: IEditModal) => {
    const [file, setFile] = useState<TFileResult>();
    const [name, setName] = useState(data.name);
    const [isPending, startTransition] = useTransition();

    const formRef = useRef<HTMLFormElement>(null);

    async function handleFileUpload(filesList: FileList) {
        const selectedFiles = filesList;
        if (!selectedFiles?.length) return;

        [...selectedFiles].forEach((file) => {
            const result = validFiles(file);
            if (result.status === "error") {
                toast.error(result.message);
            }
            setFile(result);
        });

        formRef.current?.reset();
    }

    const handleDropImage = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = event.dataTransfer;
        handleFileUpload(data.files);
    };

    const handleUpdateUser = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();

        if (file && file.fileUpload) {
            formData.append("files", file.fileUpload);
            URL.revokeObjectURL(file.imgUrl as string);
        }

        startTransition(async () => {
            const response = await updateUser({
                formData,
                name,
                user: data,
            });
            if (response.status) {
                toast.success(response.message);
                onClose();
            } else {
                toast.error(response.message || "Failed to update user");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden p-6 max-w-lg mx-auto rounded-xl shadow-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center mb-4">
                        Update Your Profile
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground text-center mb-6">
                        Edit your personal details and avatar.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleUpdateUser}
                    action={""}
                    ref={formRef}
                    onDrop={handleDropImage}
                    onDragOver={(e) => e.preventDefault()}
                    className="space-y-6"
                >
                    {/* Avatar Upload Section */}
                    <div className="flex justify-between items-center border-b-2 py-4">
                        <Avatar className="size-[140px]">
                            <AvatarImage
                                src={(file?.imgUrl as string) || data.avatar}
                            />
                            <AvatarFallback>
                                <Image
                                    src={avatarPlaceholder || ""}
                                    alt={data.name}
                                    width={140}
                                    height={140}
                                    sizes="50vw"
                                />
                            </AvatarFallback>
                        </Avatar>

                        <div className=" flex flex-col gap-2">
                            <Label htmlFor="upload" className="block ">
                                Upload New Avatar
                            </Label>
                            <Input
                                type="file"
                                id="upload"
                                accept=".png, .jpg, .webp"
                                onChange={(e) =>
                                    handleFileUpload(e.target.files!)
                                }
                            />
                        </div>
                    </div>

                    {/* Name Input Section */}
                    <div className="space-y-2">
                        <div className=" flex flex-col gap-2">
                            <Label
                                htmlFor="old-name"
                                className="text-sm font-medium"
                            >
                                Name
                            </Label>
                            <Input
                                type="text"
                                id="old-name"
                                defaultValue={data.name}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className=" flex flex-col gap-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                New Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <LoadingButton
                            type="submit"
                            isLoading={isPending}
                            loadingText="Saving..."
                            className="w-full sm:w-auto  transition-all duration-200 hover:scale-102"
                        >
                            Save Changes
                        </LoadingButton>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

EditModal.displayName = "EditModal";
export { EditModal };
