import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TPhotoData } from "@/types/server/type-photo";
import { CircleX, CloudDownload, FilePenLine, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { handleDownloadImage } from "@/utils/download-image";
import { toast } from "sonner";
import { addFavoritePhoto } from "@/actions/photos-action";

interface ICardPhoto {
    photo: TPhotoData;
    setPhotos: React.Dispatch<React.SetStateAction<TPhotoData[] | null>>;
    index: number;
}

const CardPhotoComponent = ({ photo, setPhotos }: ICardPhoto) => {
    const handleAddFavoritePhoto = async (photo: TPhotoData) => {
        if (!photo.my_user_id) {
            toast.warning("Please login!");
        } else {
            const newPhoto = { ...photo, is_favorite: !photo.is_favorite };

            setPhotos((photos) => {
                if (photos) {
                    return photos.map((item) =>
                        item._id === newPhoto._id ? newPhoto : item
                    );
                }
                return photos;
            });

            const response = await addFavoritePhoto(photo);
            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        }
    };

    return (
        <div className="group relative w-full rounded-lg overflow-hidden border mb-5 shadow-lg transition-all duration-300 ease-in-out">
            <div className="relative aspect-square">
                <Image
                    src={photo.imgUrl}
                    alt={photo.title}
                    width={200}
                    height={280}
                    sizes="60vw"
                    placeholder="blur"
                    blurDataURL={photo.blurHash}
                    className="object-cover w-full min-h-[360px] rounded-lg overflow-hidden duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo?.my_user_id === photo?.user?._id && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full bg-white/80 hover:bg-white"
                            aria-label="Edit"
                        >
                            <FilePenLine className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full bg-white/80 hover:bg-white"
                            aria-label="Delete"
                        >
                            <CircleX className="h-4 w-4 text-gray-700" />
                        </Button>
                    </>
                )}
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white"
                    aria-label="Add to favorites"
                    onClick={() => handleAddFavoritePhoto(photo)}
                >
                    <Heart
                        className={cn(
                            "h-4 w-4",
                            photo.is_favorite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-700"
                        )}
                    />
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                <Link
                    href={`/profile/${photo.user._id}`}
                    title={photo?.user?._id}
                    className="flex items-center space-x-2 text-white"
                >
                    <Avatar className="shadow-lg bg-white">
                        <AvatarImage src={photo.user.avatar || ""} />
                        <AvatarFallback className="text-foreground">
                            {photo.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                        @{photo.user.name}
                    </span>
                </Link>

                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white"
                    onClick={() => handleDownloadImage(photo)}
                    aria-label="Download Image"
                >
                    <CloudDownload className="h-4 w-4 text-gray-700" />
                </Button>
            </div>
        </div>
    );
};

CardPhotoComponent.displayName = "CardPhoto";
const CardPhoto = React.memo(CardPhotoComponent);
export { CardPhoto };
