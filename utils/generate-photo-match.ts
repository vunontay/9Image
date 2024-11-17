import { Types } from "mongoose";

export function generatePhotosMatch(query: { [key: string]: string }) {
    const page = query.page;
    const next = query.next;

    const paginationId = {
        _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true },
    };

    const paginationUpdatedAt = {
        updateAt: next ? { $lt: new Date(next) } : { $exists: true },
    };

    if (page === "home") {
        return { public: true, ...paginationId };
    }
}
