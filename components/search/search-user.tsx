import { getUsers } from "@/actions/user-action";
import { ListOfUser } from "@/components/profile/list-of-user";
import { TSearchPage } from "@/types/server/type-page";

interface ISearchUser {
    search: string;
    page: TSearchPage;
}

const SearchUser = async ({ page, search }: ISearchUser) => {
    if (page !== "users") return null;
    const { users, nextCursor } = await getUsers({ page, search });

    return (
        <div>
            <ListOfUser
                data={users}
                nextCursor={nextCursor}
                fetchingData={getUsers}
                query={{ page, search }}
            />
        </div>
    );
};

SearchUser.displayName = "SearchUser";

export { SearchUser };
