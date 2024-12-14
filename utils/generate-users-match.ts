import { TProfilePage } from "@/types/server/type-page";
import { Types } from "mongoose";

export function generateUsersMatch(query: { [key: string]: string }) {
    const page = query.page as TProfilePage;
    const next = query.next;
    const id = query.id;

    const paginationId = {
        _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true },
    };

    const paginationUpdatedAt = {
        updatedAt: next ? { $lt: new Date(next) } : { $exists: true },
    };

    if (page === "following") {
        return { followers: new Types.ObjectId(id), ...paginationUpdatedAt };
    }

    if (page === "follower") {
        return { followings: new Types.ObjectId(id), ...paginationUpdatedAt };
    }

    if (page === "users") {
        return paginationId;
    }
}
