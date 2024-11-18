import { ProfileInfo } from "@/components/profile/info";
import { getUser } from "@/lib/server/workos/session";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const resolvedParams = await params;
    const id = resolvedParams.slug[0];
    // const page = resolvedParams.slug[1] || "public";
    const userInfo = await getUser();
    if (!userInfo) {
        return <div>Error: User not found or not logged in</div>;
    }

    return (
        <>
            <ProfileInfo data={userInfo} id={id} />
        </>
    );
}
