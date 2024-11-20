import { ProfileFollow } from "@/components/profile/follow";
import { ProfileGallery } from "@/components/profile/gallery";
import { ProfileInfo } from "@/components/profile/info";
import { ProfileMenu } from "@/components/profile/menu";
import { getUser } from "@/lib/server/workos/session";
import { TProfilePage } from "@/types/server/type-page";

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
