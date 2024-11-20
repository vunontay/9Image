import { getUserById } from "@/actions/user-action";
import { ProfileDetail } from "@/components/profile/detail";
import { TUser } from "@/types/server/type-user";
import { notFound } from "next/navigation";
import React from "react";

interface IProfileInfo {
    id: string;
    data: TUser | null;
}

const ProfileInfo = async ({ data, id }: IProfileInfo) => {
    const response = await getUserById(data ?? null, id);

    if (response.status !== true || !response.user) {
        notFound();
    }

    const user = response.user;

    return (
        <div>
            <ProfileDetail data={user} />
        </div>
    );
};

ProfileInfo.displayName = "ProfileInfo";
export { ProfileInfo };
