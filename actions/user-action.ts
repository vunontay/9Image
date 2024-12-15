"use server";

import {
    destroyFromCloudinary,
    uploadToCloudinary,
} from "@/lib/server/cloudinary/cloudinary";
import mongooseConnect from "@/lib/server/mongoose/mongoose";
import { getUser } from "@/lib/server/workos/session";
import UserModel from "@/models/user-model";
import { TFileData } from "@/types/server/type-file";
import { TUser } from "@/types/server/type-user";
import { generateNextCursor } from "@/utils/generate-next-cursor";
import { generateUsersMatch } from "@/utils/generate-users-match";
import { PipelineStage, Types } from "mongoose";
import { revalidatePath } from "next/cache";

// ---------------------------GET USER BY ID ----------------------------
export async function getUserById(data: TUser | null, id: string) {
    try {
        await mongooseConnect();

        if (!Types.ObjectId.isValid(id)) {
            return {
                status: false,
                message: "Invalid user ID format",
                user: {},
            };
        }

        if (data?._id === id) {
            return {
                status: true,
                message: "Get user info success",
                user: data,
            };
        }

        const objectId = new Types.ObjectId(id);

        const user = await UserModel.findById(objectId);
        if (!user) {
            return { status: true, message: "User does not exist", user: {} };
        }

        const newUser = {
            ...user._doc,
            _id: user._id.toString(),
            total_followers: user.followers.length,
            total_followings: user.followings.length,
            followers: [],
            followings: [],
            is_following: user.followers.includes(data?._id),
            my_user_id: data?._id,
        };

        return {
            status: true,
            message: "Get user info success",
            user: newUser,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

// ---------------------------UPDATE USER----------------------------

export async function updateUser({
    formData,
    name,
    user,
}: {
    formData: FormData;
    name: string;
    user: TUser;
}) {
    try {
        await mongooseConnect();
        const files = formData.getAll("files") as TFileData[];
        if (!files.length) {
            // Avatar not change, only name changes
            await UserModel.findByIdAndUpdate(user._id, {
                name,
            });
        } else {
            // Avatar change
            const [response] = await uploadToCloudinary(files, user._id);

            await Promise.all([
                UserModel.findByIdAndUpdate(user._id, {
                    name,
                    avatar: response.secure_url,
                    public_id: response.public_id,
                }),
                destroyFromCloudinary(user.public_id),
            ]);
        }

        revalidatePath("/");
        return {
            status: true,
            message: "Update user info success",
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

// ---------------------------FOLLOW USER----------------------------

export async function followerUser({
    my_user_id,
    _id,
    isFollowing,
}: {
    my_user_id: string;
    _id: string;
    isFollowing: boolean;
}) {
    try {
        await mongooseConnect();

        if (isFollowing) {
            await Promise.all([
                UserModel.findByIdAndUpdate(my_user_id, {
                    $pull: { followings: _id },
                }),
                UserModel.findByIdAndUpdate(_id, {
                    $pull: { followers: my_user_id },
                }),
            ]);
        } else {
            await Promise.all([
                UserModel.findByIdAndUpdate(my_user_id, {
                    $push: { followings: _id },
                }),
                UserModel.findByIdAndUpdate(_id, {
                    $push: { followers: my_user_id },
                }),
            ]);
        }
        revalidatePath("/profile/[...slug]");
        return {
            status: true,
            message: "Follow user success",
            is_following: isFollowing,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    }
}

// ---------------------------GENERATE USER PIPELINE----------------------------

export async function generateUsersPipeline({
    sort,
    limit,
    match,
    search,
}: Record<string, unknown>): Promise<PipelineStage[]> {
    const user = await getUser();
    const userId = user ? new Types.ObjectId(user?._id) : undefined;
    console.log(limit);
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
            $addFields: {
                is_following: {
                    $cond: [{ $in: [userId, "$followers"] }, true, false],
                },

                my_user_id: userId,
            },
        },
        {
            $project: {
                followers: 0,
                followings: 0,
            },
        },
    ];

    const searchPipeline: PipelineStage[] = [
        {
            $search: {
                index: "searchUsers",
                text: {
                    query: search,
                    path: "name",
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

export async function generateUsersCountPipeline({
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
                index: "searchUsers",
                text: {
                    query: search,
                    path: "name",
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

// ---------------------------GET USERS----------------------------

export async function getUsers(query: {
    [key: string]: string;
}): Promise<{ users: TUser[]; nextCursor: string | number }> {
    try {
        await mongooseConnect();
        const search = query.search;

        const sort = query.sort || "_id";
        const limit = parseInt(query.limit, 10) || 5;

        const match = generateUsersMatch(query);
        const pipeline = await generateUsersPipeline({
            sort,
            limit,
            match,
            search,
        });

        const users = JSON.parse(
            JSON.stringify(await UserModel.aggregate(pipeline))
        );

        const nextCursor = generateNextCursor({ sort, limit, data: users });
        return {
            users,
            nextCursor,
        };
    } catch (error) {
        console.error("Error get users:", error);

        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred while getting the users");
    }
}

// ---------------------------GET USER COUNT ----------------------------

export async function getUsersCount(query: { [key: string]: string }) {
    try {
        await mongooseConnect();
        const search = query.search;
        const match = generateUsersMatch(query);
        const pipeline = await generateUsersCountPipeline({ match, search });

        const [result] = JSON.parse(
            JSON.stringify(await UserModel.aggregate(pipeline))
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
