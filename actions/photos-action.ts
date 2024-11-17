"use server";
import { getUser } from "@/lib/server/workos/session";
import { generatePhotosMatch } from "@/utils/generate-photo-match";
import { Types, PipelineStage } from "mongoose";
import { TPhotoData } from "@/types/server/type-photo";
import { generateNextCursor } from "@/utils/generate-next-cursor";

import PhotoModel from "@/models/photo-model";
import mongooseConnect from "@/lib/server/mongoose/mongoose";

export async function generatePhotosPipeline({
    sort,
    limit,
    match,
}: Record<string, unknown>): Promise<PipelineStage[]> {
    const user = await getUser();
    const userId = user ? new Types.ObjectId(user._id) : undefined;

    const basePipeline: PipelineStage[] = [
        {
            $sort: sort === "_id" ? { _id: -1 } : { updatedAt: -1 },
        },
        {
            $match: match || {},
        },
        {
            $limit: limit as number,
        },
        {
            $lookup: {
                from: "users",
                let: {
                    user_id: "$user",
                },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ["$_id", "$$user_id"] } },
                    },
                    {
                        $project: { name: 1, avatar: 1 },
                    },
                ],
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $addFields: {
                is_favorite: {
                    $cond: [{ $in: [userId, "$favorite_users"] }, true, false],
                },
                total_favorite: {
                    $size: "$favorite_users",
                },
                my_user_id: userId,
            },
        },
        {
            $project: {
                favorite_users: 0,
            },
        },
    ];

    return basePipeline;
}

export async function getPhotos(query: {
    [key: string]: string;
}): Promise<{ photos: TPhotoData[]; nextCursor: string | number }> {
    try {
        const sort = query.sort || "_id";
        const limit = parseInt(query.limit, 10) || 5;

        await mongooseConnect();
        const match = generatePhotosMatch(query);

        const pipeline = await generatePhotosPipeline({ sort, limit, match });

        const photos = JSON.parse(
            JSON.stringify(await PhotoModel.aggregate(pipeline))
        ) as TPhotoData[];

        const nextCursor = generateNextCursor({ sort, limit, data: photos });
        return {
            photos,
            nextCursor,
        };
    } catch (error) {
        console.error("Error fetching photos:", error);
        return {
            photos: [],
            nextCursor: "stop",
        };
    }
}
