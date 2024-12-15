import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileFollow } from "@/components/profile/follow";
import { ProfileMenu } from "@/components/profile/menu";
import { getUser } from "@/lib/server/workos/session";
import { TProfilePage } from "@/types/server/type-page";

const LoadingGallery = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
        {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
    </div>
);

const LoadingProfile = () => (
    <div className="flex gap-4 p-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
        </div>
    </div>
);

const ProfileGallery = dynamic(
    () =>
        import("@/components/profile/gallery").then(
            (mod) => mod.ProfileGallery
        ),
    {
        loading: () => <LoadingGallery />,
    }
);

const ProfileInfo = dynamic(
    () => import("@/components/profile/info").then((mod) => mod.ProfileInfo),
    {
        loading: () => <LoadingProfile />,
    }
);

export default async function ProfilePage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const resolvedParams = await params;
    const id = resolvedParams.slug[0];
    const page = resolvedParams.slug[1] || "public";
    const userInfo = await getUser();

    return (
        <>
            <ProfileInfo data={userInfo || null} id={id} />
            <ProfileFollow id={id} page={page as TProfilePage} />
            <ProfileMenu
                id={id}
                page={page as TProfilePage}
                userId={userInfo?._id}
            />
            <ProfileGallery
                id={id}
                page={page as TProfilePage}
                userId={userInfo?._id}
            />
        </>
    );
}
