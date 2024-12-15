import { getPhotos } from "@/actions/photos-action";
import { GalleryPhoto } from "@/components/photo/gallery-photo";
import { H3 } from "@/components/shared/title";
import { OrderButton } from "@/components/sort/order-button";

export const dynamic = "force-dynamic";

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string }>;
}) {
    const { sort } = await searchParams;
    const { photos: data, nextCursor } = await getPhotos({
        page: "home",
        sort: sort || "newest",
    });

    return (
        <>
            <div className="flex justify-between items-center py-6 md:py-8">
                <H3 title="Free Stock Photos" className="text-2xl font-bold" />
                <OrderButton />
            </div>
            <GalleryPhoto
                key={sort}
                data={data}
                nextCursor={nextCursor}
                fetchingData={getPhotos}
                query={{
                    page: "home",
                    sort: sort || "newest",
                }}
            />
        </>
    );
}
