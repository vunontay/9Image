import dynamic from "next/dynamic";
import { Spinner } from "@/components/shared/spinner";
import { ProfileFollow } from "@/components/profile/follow";
import { ProfileMenu } from "@/components/profile/menu";
import { getUser } from "@/lib/server/workos/session";
import { TProfilePage } from "@/types/server/type-page";

const LoadingGallery = () => (
    <div className="py-10 flex justify-center">
        <Spinner />
    </div>
);
const LoadingProfile = () => (
    <div className="py-4 flex justify-center">
        <Spinner />
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
