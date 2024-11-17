import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TFileResult } from "@/types/client/type-file";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputTags } from "@/components/custom/input-tags";
import Image from "next/image";
import React from "react";

interface IUploadCard {
    setFiles: React.Dispatch<React.SetStateAction<TFileResult[]>>;
    file: TFileResult;
    index: number;
}

interface ValidationInput {
    title: string;
    tags: string[];
}

interface Errors {
    title?: string;
    tags?: string;
}

type ValidationStatus = "error" | "success";

const validate = ({ title, tags }: ValidationInput): ValidationStatus => {
    const errors: Errors = {}; // Explicitly define errors as type Errors

    if (title.length > 50) {
        errors.title = "Title must be at most 50 characters";
    }

    if (tags.length > 5) {
        errors.tags = "You can add up to 5 tags only";
    }

    return errors.title || errors.tags ? "error" : "success";
};

const UploadCardComponent = ({ setFiles, file, index }: IUploadCard) => {
    const handleRemove = () => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setFiles((prevFiles) =>
            prevFiles.map((f, i) =>
                i === index
                    ? {
                          ...f,
                          title: newTitle,
                          status: validate({
                              title: newTitle,
                              tags: file?.tags || [],
                          }),
                      }
                    : f
            )
        );
    };

    const handleTagChange = (newTags: string[]) => {
        setFiles((prevFiles) =>
            prevFiles.map((f, i) =>
                i === index
                    ? {
                          ...f,
                          tags: newTags,
                          status: validate({
                              title: file.title,
                              tags: newTags,
                          }),
                      }
                    : f
            )
        );
    };

    // Add handler for the checkbox change to update the `public` status
    const handlePublicToggle = (checked: boolean) => {
        setFiles((prevFiles) =>
            prevFiles.map((f, i) =>
                i === index ? { ...f, public: checked } : f
            )
        );
    };

    const isLoading = false;

    return (
        <div
            className={cn(
                "group relative w-full rounded-lg overflow-hidden border border-gray-200 mb-5 p-4 transition-transform duration-700 ease-in-out",
                "hover:scale-105",
                file.status === "success" ? "bg-green-200/10" : "bg-red-400/10"
            )}
        >
            {/* Close Icon on Hover */}
            <Button
                onClick={handleRemove}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive"
                title="Remove image"
            >
                <X className="w-4 h-4 text-gray-500 hover:text-white" />
            </Button>

            <Image
                src={file.imgUrl}
                alt={file.title || "Uploaded file"}
                width={280}
                height={280}
                title={file.title || "Uploaded file"}
                className={cn(
                    "object-cover w-full rounded-lg overflow-hidden",
                    isLoading
                        ? "scale-110 blur-2xl grayscale"
                        : "scale-100 blur-0 grayscale-0"
                )}
            />

            {file.status === "error" && file.message ? (
                <div className="text-left py-2">
                    <span className="font-bold text-lg">Error</span>
                    <p className="text-destructive text-sm font-medium">
                        {file.message}
                    </p>
                </div>
            ) : (
                <div className="py-4">
                    <div className="mb-2">
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Add a title"
                            value={file.title || ""}
                            onChange={handleTitleChange}
                            maxLength={100}
                            title={`${file.title?.length || 0}/50 Characters`}
                        />
                    </div>

                    {/* InputTags Component for managing tags */}
                    <InputTags
                        value={file.tags || []}
                        onChange={handleTagChange}
                        placeholder="Add a tag"
                        className="mb-2"
                        title={`${file.tags?.length || 0}/5 Tag`}
                    />

                    {/* Checkbox for making the photo public */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Checkbox
                            id={`public-${index}`}
                            checked={file.public || false}
                            onCheckedChange={handlePublicToggle}
                        />
                        <Label
                            htmlFor={`public-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Make photo public
                        </Label>
                        <Lock className="size-4" />
                    </div>
                </div>
            )}
        </div>
    );
};

UploadCardComponent.displayName = "UploadCard";
const UploadCard = React.memo(UploadCardComponent);
export { UploadCard };
