import { getPhotosCount } from "@/actions/photos-action";
import { H3 } from "@/components/shared/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TProfilePage } from "@/types/server/type-page";
import { formatNumber } from "@/utils/format-number";
import { FolderHeart, FolderLock, Images } from "lucide-react";
import Link from "next/link";

interface IProfileMenu {
    id: string;
    page: TProfilePage;
    userId: string | null | undefined;
}

const ProfileMenu = async ({ id, page, userId }: IProfileMenu) => {
    const pages = ["public", "private", "favorite"] as TProfilePage[];

    if (!pages.includes(page) || !userId) return null;

    const [publicCount, privateCount, favoriteCount] = await Promise.all([
        getPhotosCount({ id, page: "public", userId }),
        getPhotosCount({ id, page: "private", userId }),
        getPhotosCount({ id, page: "favorite", userId }),
    ]);

    return (
        <Tabs value={page} className="w-full mt-4">
            <TabsList className="border-2">
                {pages.map((tabPage) => {
                    if (id !== userId && tabPage !== "public") return null;

                    return (
                        <TabsTrigger
                            key={tabPage}
                            value={tabPage}
                            asChild
                            disabled={id === userId ? true : false}
                        >
                            <Link
                                href={
                                    tabPage === "public"
                                        ? `/profile/${id}`
                                        : `/profile/${id}/${tabPage}`
                                }
                                className="flex items-center gap-2"
                                aria-current={
                                    pages.includes(tabPage) ? "page" : undefined
                                }
                            >
                                {tabPage === "public" && (
                                    <Images className="h-4 w-4" />
                                )}
                                {tabPage === "private" && (
                                    <FolderLock className="h-4 w-4" />
                                )}
                                {tabPage === "favorite" && (
                                    <FolderHeart className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">
                                    {tabPage.charAt(0).toUpperCase() +
                                        tabPage.slice(1)}{" "}
                                    <span className="font-normal">Photos</span>
                                </span>
                                <span className="text-xs">
                                    (
                                    {formatNumber(
                                        tabPage === "public"
                                            ? publicCount.data
                                            : tabPage === "private"
                                            ? privateCount.data
                                            : favoriteCount.data
                                    )}
                                    )
                                </span>
                            </Link>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            <TabsContent value="public">
                <H3
                    title="Public photos"
                    className="text-xl font-bold pb-4 text-center capitalize"
                />
            </TabsContent>
            <TabsContent value="private">
                <H3
                    title="Private photos"
                    className="text-xl font-bold pb-4 text-center capitalize"
                />
            </TabsContent>
            <TabsContent value="favorite">
                {" "}
                <H3
                    title="Favorite photos"
                    className="text-xl font-bold pb-4 text-center capitalize"
                />
            </TabsContent>
        </Tabs>
    );
};

ProfileMenu.displayName = "ProfileMenu";
export { ProfileMenu };
