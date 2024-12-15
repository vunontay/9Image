"use server";
import { getUser } from "@/lib/server/workos/session";
import { generatePhotosMatch } from "@/utils/generate-photo-match";
import { Types, PipelineStage } from "mongoose";
import { TPhotoData } from "@/types/server/type-photo";
import { generateNextCursor } from "@/utils/generate-next-cursor";

import PhotoModel from "@/models/photo-model";
import mongooseConnect from "@/lib/server/mongoose/mongoose";
import { revalidatePath } from "next/cache";
import { destroyFromCloudinary } from "@/lib/server/cloudinary/cloudinary";
import { cache } from "react";

export async function generatePhotosPipeline({
    sort,
    limit,
    match,
    search,
}: Record<string, unknown>): Promise<PipelineStage[]> {
    const user = await getUser();
    const userId = user ? new Types.ObjectId(user?._id) : undefined;

    const basePipeline: PipelineStage[] = [
        {
            $sort: (() => {
                const sortObj: Record<string, -1> = {};
                switch (sort) {
                    case "newest":
                        sortObj.createdAt = -1;
                        break;
                    case "popular":
                        sortObj.total_favorite = -1;
                        break;
                    case "trending":
                        sortObj.views = -1;
                        break;
                    default:
                        sortObj._id = -1;
                }
                return sortObj;
            })(),
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

    const searchPipeline: PipelineStage[] = [
        {
            $search: {
                index: "searchPhotos",
                text: {
                    query: search,
                    path: ["title", "tags"],
                    fuzzy: {
                        prefixLength: 3,
                    },
                },
            },
        },
    ];

    if (search) {
        return [...searchPipeline, ...basePipeline];
    }

    return basePipeline;
}

export async function generatePhotosCountPipeline({
    match,
    search,
}: Record<string, unknown>): Promise<PipelineStage[]> {
    const basePipeline: PipelineStage[] = [
        {
            $match: match || {},
        },
        {
            $count: "total",
        },
    ];

    const searchPipeline: PipelineStage[] = [
        {
            $search: {
                index: "searchPhotos",
                text: {
                    query: search,
                    path: ["title", "tags"],
                    fuzzy: {
                        prefixLength: 3,
                    },
                },
            },
        },
    ];
    if (search) {
        return [...searchPipeline, ...basePipeline];
    }
    return basePipeline;
}

// ---------------------------GET PHOTOS----------------------------

export const getPhotos = cache(
    async (query: {
        [key: string]: string;
    }): Promise<{ photos: TPhotoData[]; nextCursor: string | number }> => {
        try {
            await mongooseConnect();
            const search = query.search;

            const sort = query.sort || "newest";
            const limit = parseInt(query.limit, 10) || 5;

            const match = generatePhotosMatch(query);

            const pipeline = await generatePhotosPipeline({
                sort,
                limit,
                match,
                search,
            });

            const photos = JSON.parse(
                JSON.stringify(await PhotoModel.aggregate(pipeline))
            ) as TPhotoData[];

            const nextCursor = generateNextCursor({
                sort,
                limit,
                data: photos,
            });

            return {
                photos,
                nextCursor,
            };
        } catch {
            return {
                photos: [],
                nextCursor: "stop",
            };
        }
    }
);

// ---------------------------GET PHOTOS COUNT ----------------------------

export async function getPhotosCount(query: { [key: string]: string }) {
    try {
        await mongooseConnect();
        const search = query.search;
        const match = generatePhotosMatch(query);
        const pipeline = await generatePhotosCountPipeline({ match, search });
        const [result] = JSON.parse(
            JSON.stringify(await PhotoModel.aggregate(pipeline))
        );

        return {
            success: true,
            data: result?.total || 0,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

// ---------------------------ADD FAVORITE PHOTO----------------------------

export async function addFavoritePhoto(photo: TPhotoData) {
    try {
        await mongooseConnect();
        if (photo.is_favorite) {
            await PhotoModel.findByIdAndUpdate(photo._id, {
                $pull: { favorite_users: photo.my_user_id },
            });
        } else {
            await PhotoModel.findByIdAndUpdate(photo._id, {
                $push: { favorite_users: photo.my_user_id },
            });
        }

        return {
            success: true,
            message: "Favorite photo updated successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred while updating the favorite photo");
    } finally {
        revalidatePath("/");
        revalidatePath(`/profile/${photo._id}/favorite`);
    }
}

// ---------------------------UPDATE PHOTO----------------------------

export async function updatePhoto(photo: TPhotoData) {
    try {
        await mongooseConnect();
        await PhotoModel.findByIdAndUpdate(photo?._id, {
            title: photo.title,
            tags: photo.tags,
            public: photo.public,
        });

        revalidatePath("/");

        return {
            success: true,
            message: "Photo update successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

// ---------------------------DELETE PHOTO----------------------------
export async function deletePhoto({ _id, public_id }: TPhotoData) {
    try {
        await mongooseConnect();
        await Promise.all([
            PhotoModel.findByIdAndDelete(_id),
            destroyFromCloudinary(public_id),
        ]);

        revalidatePath("/");
        return {
            success: true,
            message: "Photo delete successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

export async function getPhotoById(id: string) {
    try {
        const [user, photo] = await Promise.all([
            getUser(),
            PhotoModel.findById(id).populate("user", "name avatar"),
        ]);

        if (!photo) throw new Error("Photo not found");

        const newPhoto = {
            ...photo._doc,
            is_favorite: photo.favorite_users.includes(user?._id),
            total_favorite: photo.favorite_users.length,
            favorite_users: [],
            my_user_id: user?._id,
        };

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newPhoto)),
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}
