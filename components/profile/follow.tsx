import { getUsers } from "@/actions/user-action";
import { ListOfUser } from "@/components/profile/list-of-user";
import { H2 } from "@/components/shared/title";

import { TProfilePage } from "@/types/server/type-page";

import React from "react";

interface IProfileFollow {
    id: string;
    page: TProfilePage;
}

const ProfileFollow = async ({ id, page }: IProfileFollow) => {
    if (page !== "follower" && page !== "following") return null;

    const sort = "updatedAt";
    const { users: data, nextCursor } = await getUsers({ id, sort, page });

    return (
        <div className="space-y-4">
            <H2
                title={`List of ${page}`}
                className="text-2xl font-bold py-4 border-b-2"
            />
            <ListOfUser
                data={data}
                nextCursor={nextCursor}
                fetchingData={getUsers}
                query={{ id, sort, page }}
            />
        </div>
    );
};

ProfileFollow.displayName = "ProfileFollow";
export { ProfileFollow };
