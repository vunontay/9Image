import { getPhotosCount } from "@/actions/photos-action";
import { getUsersCount } from "@/actions/user-action";
import { H3 } from "@/components/shared/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TSearchPage } from "@/types/server/type-page";
import { formatNumber } from "@/utils/format-number";
import { Images, Users, Lock } from "lucide-react";
import Link from "next/link";

interface ISearchMenu {
    id: string;
    search: string;
    page: TSearchPage;
}

const SearchMenu = async ({ id, page, search }: ISearchMenu) => {
    const pages = ["photos", "users", "private"] as TSearchPage[];

    if (!pages.includes(page)) return null;
    const [photosCount, usersCount, privateCount] = await Promise.all([
        getPhotosCount({ page: "photos", search: search }),
        getUsersCount({ page: "users", search: search }),
        id
            ? getPhotosCount({ page: "private", search: search, id })
            : { success: true, data: 0 },
    ]);

    return (
        <Tabs value={page} className="w-full mt-4">
            <TabsList className="border-2">
                {pages.map((tabPage) => {
                    if (!id && tabPage === "private") return null;

                    return (
                        <TabsTrigger key={tabPage} value={tabPage} asChild>
                            <Link
                                href={`/search/${tabPage}/${search}`}
                                className="flex items-center gap-2"
                            >
                                {tabPage === "photos" && (
                                    <Images className="h-4 w-4" />
                                )}
                                {tabPage === "users" && (
                                    <Users className="h-4 w-4" />
                                )}
                                {tabPage === "private" && (
                                    <Lock className="h-4 w-4" />
                                )}

                                <span className="hidden sm:inline">
                                    {tabPage.charAt(0).toUpperCase() +
                                        tabPage.slice(1)}{" "}
                                </span>
                                <span className="text-xs">
                                    (
                                    {formatNumber(
                                        tabPage === "photos"
                                            ? photosCount.data
                                            : tabPage === "users"
                                            ? usersCount.data
                                            : privateCount.data
                                    )}
                                    )
                                </span>
                            </Link>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            {pages.map((tabPage) => (
                <TabsContent key={tabPage} value={tabPage}>
                    <H3
                        title={`${
                            tabPage.charAt(0).toUpperCase() + tabPage.slice(1)
                        } `}
                        className="text-xl font-bold pb-4 text-center capitalize"
                    />
                </TabsContent>
            ))}
        </Tabs>
    );
};

SearchMenu.displayName = "SearchMenu";
export { SearchMenu };
