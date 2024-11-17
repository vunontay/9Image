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
    if (sort === "updatedAt") {
        return new Date(data[limit - 1].updatedAt ?? "").getTime() || "stop";
    } else {
        return data[limit - 1]?._id || "stop";
    }
}
