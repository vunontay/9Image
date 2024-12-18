import { TSearchPage } from "@/types/server/type-page";
import { Types } from "mongoose";

export function generatePhotosMatch(query: { [key: string]: string }) {
    const page = query.page as TSearchPage;
    const next = query.next;
    const id = query.id;

    const paginationId = {
        _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true },
    };

    const paginationUpdatedAt = {
        updatedAt: next ? { $lt: new Date(next) } : { $exists: true },
    };

    if (page === "public") {
        return { public: true, user: new Types.ObjectId(id), ...paginationId };
    }

    if (page === "private") {
        return { public: false, user: new Types.ObjectId(id), ...paginationId };
    }

    if (page === "favorite") {
        return {
            public: true,
            favorite_users: new Types.ObjectId(id),
            ...paginationId,
        };
    }

    if (page === "home" || page === "photos") {
        return { public: true, ...paginationId };
    }
}
