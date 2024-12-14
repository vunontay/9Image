import { getPhotos } from "@/actions/photos-action";
import { GalleryPhoto } from "@/components/photo/gallery-photo";
import { TSearchPage } from "@/types/server/type-page";
import React from "react";

interface ISearchGallery {
    id: string;
    search: string;
    page: TSearchPage;
}

const SearchGallery = async ({ id, page, search }: ISearchGallery) => {
    if (page !== "photos" && page !== "private") return null;

    const { photos, nextCursor } = await getPhotos({ page, search, id });

    return (
        <>
            <GalleryPhoto
                data={photos}
                nextCursor={nextCursor}
                fetchingData={getPhotos}
                query={{ page, search, id }}
            />
        </>
    );
};

SearchGallery.displayName = "SearchGallery";
export { SearchGallery };
