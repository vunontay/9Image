"use client";
import { CardPhoto } from "@/components/photo/card-photo";
import { Spinner } from "@/components/shared/spinner";
import { TPhotoData } from "@/types/client/type-photo";
import useInView from "@/hooks/use-in-view";
import React, { useEffect, useState, useTransition, useMemo } from "react";
import { optimizeImageUrl } from "@/utils/optimize-image-url";

interface IGalleryPhoto {
    data: TPhotoData[] | null;
    query: {
        [key: string]: string;
    };
    fetchingData: (query: { [key: string]: string }) => Promise<{
        photos: TPhotoData[];
        nextCursor: string | number;
    }>;
    nextCursor: string | number;
}

const GalleryPhoto = ({
    data,
    query,
    fetchingData,
    nextCursor,
}: IGalleryPhoto) => {
    const [files, setFiles] = useState<TPhotoData[]>(data || []);
    const [next, setNext] = useState<string | number>(nextCursor);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();
    const { ref, inView } = useInView();

    const handleLoadMore = async () => {
        if (nextCursor === "stop" || isPending || !hasMore) return;

        startTransition(async () => {
            const response = await fetchingData({
                next: next.toString(),
                ...query,
            });

            const newData = [...(files || []), ...response.photos];
            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setFiles(newData);
                setNext(response.nextCursor);
            }
        });
    };

    useEffect(() => {
        if (inView && hasMore) {
            handleLoadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, hasMore]);

    const memoizedPhotos = useMemo(() => {
        return files.map((photo) => ({
            ...photo,
            optimizedUrl: optimizeImageUrl(photo.imgUrl),
        }));
    }, [files]);

    return (
        <div className="container mx-auto">
            <div className="masonry">
                {memoizedPhotos?.map((file, index) => (
                    <CardPhoto
                        key={`${file._id}-${index}`}
                        photo={file}
                        setPhotos={setFiles}
                        index={index}
                    />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="py-10 flex justify-center">
                    {isPending && <Spinner color="primary" />}
                </div>
            )}
        </div>
    );
};

GalleryPhoto.displayName = "GalleryPhoto";
export { GalleryPhoto };
