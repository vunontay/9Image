interface GenerateNextCursorParams {
    sort: "updatedAt" | string;
    limit: number;
    data: Array<{ updatedAt?: string; _id?: string }>;
}

export function generateNextCursor({
    sort,
    limit,
    data,
}: GenerateNextCursorParams): string | number {
    if (!data || data.length < limit) {
        return "stop";
    }

    const lastItem = data[limit - 1];

    if (sort === "updatedAt" && lastItem.updatedAt) {
        return new Date(lastItem.updatedAt).getTime() || "stop";
    } else if (lastItem?._id) {
        return lastItem._id;
    }

    return "stop";
}
