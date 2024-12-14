"use client";

import { Heart, CloudDownload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleDownloadImage } from "@/utils/download-image";
import { TPhotoData } from "@/types/client/type-photo";
import { addFavoritePhoto } from "@/actions/photos-action";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoActionsProps {
    photo: TPhotoData;
}

export function PhotoActions({ photo }: PhotoActionsProps) {
    const [isFavorite, setIsFavorite] = useState(photo.is_favorite);
    const [totalFavorites, setTotalFavorites] = useState(photo.total_favorite);

    const handleFavorite = async () => {
        if (!photo.my_user_id) {
            return toast.warning("Please login to add favorites!");
        }

        setIsFavorite(!isFavorite);
        setTotalFavorites((prev) => (isFavorite ? prev - 1 : prev + 1));

        const response = await addFavoritePhoto(photo);
        if (!response.success) {
            // Rollback if failed
            setIsFavorite(isFavorite);
            setTotalFavorites(totalFavorites);
            toast.error(response.message);
        }
    };

    return (
        <div className="flex items-center justify-between py-2 border-y">
            <div className="flex items-center space-x-2">
                <Heart
                    className={`h-5 w-5 cursor-pointer transition-colors ${
                        isFavorite
                            ? "text-red-500 fill-red-500"
                            : "text-gray-500 hover:text-red-500"
                    }`}
                    onClick={handleFavorite}
                />
                <span className="font-medium">{totalFavorites}</span>
            </div>
            <Button
                onClick={() => handleDownloadImage(photo)}
                variant="outline"
                className="rounded-full"
            >
                <CloudDownload className="h-4 w-4 mr-2" />
                Download
            </Button>
        </div>
    );
}
