"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validFiles } from "@/utils/valid-file";
import { useRef } from "react";
import { TFileResult } from "@/types/client/type-file";
import Form from "next/form";

interface IUploadFormComponent {
    setFiles: React.Dispatch<React.SetStateAction<TFileResult[]>>;
}

const UploadFormComponent = ({ setFiles }: IUploadFormComponent) => {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleFileUpload(filesList: FileList) {
        const selectedFiles = filesList;
        if (!selectedFiles?.length) return;

        [...selectedFiles].forEach((file) => {
            const result = validFiles(file);
            setFiles((prev) => [...prev, result]);
        });

        formRef.current?.reset();
    }

    const handleDropImage = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = event.dataTransfer;
        handleFileUpload(data.files); // Pass FileList from drag-and-drop
    };

    return (
        <Form
            action={""}
            ref={formRef}
            onDrop={handleDropImage}
            onDragOver={(e) => e.preventDefault()}
        >
            <Label
                htmlFor="upload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                Upload Image
                <Input
                    type="file"
                    id="upload"
                    onChange={(e) => handleFileUpload(e.target.files!)}
                    className="hidden"
                    multiple
                    accept=".png, .jpg, .webp"
                />
            </Label>
        </Form>
    );
};

UploadFormComponent.displayName = "UploadForm";

const UploadForm = React.memo(UploadFormComponent);
export { UploadForm };
