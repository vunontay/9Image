import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CloudDownload, Heart, Share, ZoomIn, ZoomOut } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { handleDownloadImage } from "@/utils/download-image";
import { cn } from "@/lib/utils";
import { TPhotoData } from "@/types/client/type-photo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface IDetailDialog {
    isOpen: boolean;
    onClose: () => void;
    photo: TPhotoData;
    onAddFavorite: (photo: TPhotoData) => Promise<void>;
}

const DetailDialog = ({
    isOpen,
    onClose,
    photo,
    onAddFavorite,
}: IDetailDialog) => {
    const [isPending, startTransition] = useTransition();
    const [isFavorite, setIsFavorite] = useState(photo.is_favorite);
    const [zoom, setZoom] = useState<boolean>(false);
    const [totalFavorites, setTotalFavorites] = useState(photo.total_favorite);

    const handleFavorite = async () => {
        startTransition(async () => {
            setIsFavorite(!isFavorite);
            setTotalFavorites((prev) => (isFavorite ? prev - 1 : prev + 1));
            await onAddFavorite(photo);
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[60vw] max-h-[95vh]",
                    "overflow-y-auto p-0 hide-scrollbar rounded-lg"
                )}
            >
                <DialogHeader className="p-4 sm:p-6">
                    <DialogTitle className="flex flex-wrap justify-between items-center gap-4">
                        <Link
                            href={`/profile/${photo.user._id}`}
                            className="flex items-center space-x-3 hover:underline"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={photo.user.avatar || ""}
                                    alt={photo.user.name}
                                />
                                <AvatarFallback>
                                    {photo.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-lg">
                                @{photo.user.name}
                            </span>
                        </Link>
                        <div className="flex items-center gap-2 pr-4">
                            <Button
                                asChild
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                aria-label="Share photo"
                            >
                                <Link
                                    href={`/photo/${photo._id}?s=${photo.slug}`}
                                >
                                    <Share className="h-4 w-4" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={handleFavorite}
                                disabled={isPending}
                                aria-label={
                                    isFavorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                }
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
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleDownloadImage(photo)}
                                aria-label="Download Image"
                            >
                                <CloudDownload className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="relative overflow-hidden h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
                    <div
                        className={cn(
                            "transition-transform duration-300 h-full",
                            zoom ? "scale-150 cursor-move" : "scale-100"
                        )}
                        onClick={() => setZoom(!zoom)}
                        title={zoom ? "Click to zoom out" : "Click to zoom in"}
                        style={{
                            transformOrigin: "center center",
                        }}
                    >
                        <Image
                            src={photo.imgUrl}
                            alt={photo.title}
                            layout="fill"
                            objectFit="contain"
                            priority
                            placeholder="blur"
                            blurDataURL={photo.blurHash}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-4 right-4 rounded-full bg-white/80 hover:bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(!zoom);
                        }}
                        aria-label={zoom ? "Zoom out" : "Zoom in"}
                    >
                        {zoom ? (
                            <ZoomOut className="h-4 w-4" />
                        ) : (
                            <ZoomIn className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    <Link
                        href={`/photo/${photo._id}`}
                        className="text-xl sm:text-2xl font-semibold mb-4"
                    >
                        {photo.title}
                    </Link>
                    <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <div
                            className="flex items-center space-x-2 bg-white/80 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm"
                            title="Favorites"
                        >
                            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                            <span className="text-sm sm:text-base font-medium">
                                {totalFavorites}
                            </span>
                        </div>
                        <div
                            className="text-sm text-gray-500"
                            title="Published date"
                        >
                            {formatDate(photo.createdAt)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {photo.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                                <Link
                                    href={`/search/photos/${tag}`}
                                    className="hover:bg-secondary/80"
                                >
                                    #{tag}
                                </Link>
                            </Badge>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

DetailDialog.displayName = "DetailDialog";
export { DetailDialog };
