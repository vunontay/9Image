"use server";

import {
    destroyFromCloudinary,
    uploadToCloudinary,
} from "@/lib/server/cloudinary/cloudinary";
import mongooseConnect from "@/lib/server/mongoose/mongoose";
import UserModel from "@/models/user-model";
import { TFileData } from "@/types/server/type-file";
import { TUser } from "@/types/server/type-user";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

// ---------------------------GET USER BY ID ----------------------------
export async function getUserById(data: TUser, id: string) {
    try {
        await mongooseConnect();
        if (data._id === id) {
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
            is_following: user.followers.includes(data._id),
            my_user_id: data._id,
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
