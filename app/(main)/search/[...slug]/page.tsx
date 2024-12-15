import { SearchGallery } from "@/components/search/search-gallery";
import { SearchMenu } from "@/components/search/search-menu";
import { SearchUser } from "@/components/search/search-user";
import { H1 } from "@/components/shared/title";
import { getUser } from "@/lib/server/workos/session";
import { TSearchPage } from "@/types/server/type-page";

export default async function SearchPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const resolvedParams = await params;
    const page = resolvedParams.slug[0];
    const search = decodeURI(resolvedParams.slug[1]);
    const userInfo = await getUser();

    return (
        <>
            <div className="flex justify-between py-6 md:py-8">
                <H1
                    title={`Result for ${search}`}
                    className="text-xl md:text-2xl font-bold"
                />
            </div>
            <SearchMenu
                page={page as TSearchPage}
                search={search}
                id={userInfo?._id || ""}
            />
            <SearchGallery
                page={page as TSearchPage}
                search={search}
                id={userInfo?._id || ""}
            />

            <SearchUser page={page as TSearchPage} search={search} />
        </>
    );
}
