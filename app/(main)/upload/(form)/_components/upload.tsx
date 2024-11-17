"use client";

import { UploadCard } from "@/app/(main)/upload/(form)/_components/upload-card";
import { UploadForm } from "@/app/(main)/upload/(form)/_components/upload-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Music, Video } from "lucide-react";
import useUploadImages from "@/hooks/use-upload-image";

const Upload = () => {
    const { files, setFiles, count, isPending, handleUploadImages } =
        useUploadImages();

    return (
        <>
            <div className="bg-muted flex justify-center flex-col gap-6 items-center min-h-80 rounded-md border-4 border-dashed my-10 w-full mx-auto p-4">
                <div className="flex relative">
                    <div className="bg-white text-purple-400 absolute top-[15%] left-[85%]  shadow-md rounded-full p-6 -rotate-[15deg]">
                        <Video />
                    </div>
                    <div className="bg-white text-orange-400 shadow-md rounded-full p-6 z-[1]">
                        <ImageIcon />
                    </div>
                    <div className="bg-white text-primary absolute top-[15%] right-[85%] z-[2] shadow-md rounded-full p-6 rotate-[15deg]">
                        <Music />
                    </div>
                </div>
                <div className="flex gap-2 items-center mt-2">
                    <p className="text-md font-semibold">
                        Drag and drop to upload, or
                    </p>
                    <UploadForm setFiles={setFiles} />{" "}
                    <p className="text-md font-semibold">5 Image</p>
                </div>
            </div>

            <div className="masonry">
                {files.map((file, index) => (
                    <UploadCard
                        key={index}
                        file={file}
                        setFiles={setFiles}
                        index={index}
                    />
                ))}
            </div>

            <Button
                className="mt-6 flex justify-start"
                type="submit"
                disabled={count <= 0 || count > 5 || isPending}
                onClick={handleUploadImages}
            >
                {isPending
                    ? "Loading..."
                    : count
                    ? `Submit (${count}) photos`
                    : `Submit to 9Image`}
            </Button>
        </>
    );
};
Upload.displayName = "Upload";
export { Upload };
