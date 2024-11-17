"use client";
import { CardPhoto } from "@/components/photo/card-photo";
import { Spinner } from "@/components/shared/spinner";
import { TPhotoData } from "@/types/client/type-photo";
import useInView from "@/hooks/use-in-view";
import React, { useEffect, useState, useTransition } from "react";

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
    const [files, setFiles] = useState<TPhotoData[] | null>(data || null);
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
    return (
        <div className="container mx-auto">
            <div className="masonry">
                {files?.map((file, index) => (
                    <CardPhoto
                        key={file?._id}
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
