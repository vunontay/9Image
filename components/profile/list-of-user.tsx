"use client";

import { CardUser } from "@/components/profile/card-user";
import { Spinner } from "@/components/shared/spinner";
import { TUser } from "@/types/client/type-user";
import React, { useEffect, useState, useTransition } from "react";
import useInView from "@/hooks/use-in-view";

interface IListOfUser {
    data: TUser[] | null;
    query: {
        [key: string]: string;
    };
    fetchingData: (query: { [key: string]: string }) => Promise<{
        users: TUser[];
        nextCursor: string | number;
    }>;
    nextCursor: string | number;
}

const ListOfUser = ({ data, query, fetchingData, nextCursor }: IListOfUser) => {
    const [users, setUsers] = useState<TUser[] | null>(data || null);
    const [next, setNext] = useState<string | number>(nextCursor);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();
    const { ref, inView } = useInView();

    const handleLoadMore = async () => {
        if (nextCursor === "stop" || isPending || !hasMore) return;

        startTransition(async () => {
            const response = await fetchingData({
                next: next.toString(),
                ...query,
            });

            const newData = [...(users || []), ...response.users];
            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setUsers(newData);
                setNext(response.nextCursor);
            }
        });
    };

    useEffect(() => {
        if (inView && hasMore) {
            handleLoadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, hasMore]);
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-2 gap-5">
                {users?.map((user) => (
                    <CardUser key={user._id} user={user} />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="py-10 flex justify-center">
                    {isPending && <Spinner color="primary" />}
                </div>
            )}
        </div>
    );
};

ListOfUser.displayName = "ListOfUser";
export { ListOfUser };
