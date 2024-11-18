import { getUserById } from "@/actions/user-action";
import { ProfileDetail } from "@/components/profile/detail";
import { TUser } from "@/types/server/type-user";
import React from "react";

interface IProfileInfo {
    id: string;
    data: TUser;
}

const ProfileInfo = async ({ data, id }: IProfileInfo) => {
    const response = await getUserById(data, id);

    // Check if the user is returned and the status is true
    if (response.status !== true || !response.user) {
        return <div>Error: {response.message || "User not found"}</div>;
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
