import { getPhotos } from "@/actions/photos-action";
import { GalleryPhoto } from "@/components/photo/gallery-photo";
import { H3 } from "@/components/shared/title";

export default async function HomePage() {
    const { photos: data, nextCursor } = await getPhotos({ page: "home" });

    return (
        <>
            <div className="-mx-4 sm:-mx-8 -mt-2 sm:-mt-4 relative"></div>
            <div className="flex justify-between py-6 md:py-8">
                <H3 title="Free Stock Photos" className="text-2xl font-bold" />
                {/* <OrderButton /> */}
            </div>
            <GalleryPhoto
                data={data}
                nextCursor={nextCursor}
                fetchingData={getPhotos}
                query={{ page: "home" }}
            />
        </>
    );
}
