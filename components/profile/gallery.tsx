import { getPhotos } from "@/actions/photos-action";
import { GalleryPhoto } from "@/components/photo/gallery-photo";
import { TProfilePage } from "@/types/server/type-page";
import React from "react";
import Image from "next/image";

interface IProfileGallery {
    id: string;
    page: TProfilePage;
    userId: string | null | undefined;
}

const ProfileGallery = async ({ id, page, userId }: IProfileGallery) => {
    const pages = ["public", "private", "favorite"] as TProfilePage[];

    if (!pages.includes(page) || !userId) return null;

    // Other user only show public photos
    page = id === userId ? page : "public";

    const sort = page === "favorite" ? "updatedAt" : "_id";

    const { photos: data, nextCursor } = await getPhotos({ id, sort, page });
    return (
        <>
            {data.length > 0 ? (
                <GalleryPhoto
                    data={data}
                    fetchingData={getPhotos}
                    nextCursor={nextCursor}
                    query={{ id, sort, page }}
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-400">
                    <Image
                        src="/placeholder-image.webp"
                        alt="Empty gallery"
                        className="rounded-full opacity-50 mb-4 border-4 border-dashed border-gray-300"
                        priority
                        width={200}
                        height={200}
                        sizes="50vw"
                    />
                    <p className="text-xl font-medium">No Photos Available</p>
                </div>
            )}
        </>
    );
};

ProfileGallery.displayName = "ProfileGallery";
export { ProfileGallery };
