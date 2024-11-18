import { unsealData } from "iron-session";
import { cookies } from "next/headers";
import { cookieName } from "./cookie";
import UserModel from "@/models/user-model";
import { Session } from "@/lib/server/workos/setWorkOSAuthCookie";
import { TUser } from "@/types/server/type-user";
import mongooseConnect from "@/lib/server/mongoose/mongoose";

// Retrieves the user from the session cookie and fetches from the database
export async function getUser() {
    await mongooseConnect();
    const cookieStore = await cookies();
    const encryptedSession = await cookieStore.get(cookieName);

    if (!encryptedSession) {
        console.log("No session cookie found");
        return null;
    }

    try {
        // Decrypt the session data
        const session = await unsealData<Session>(encryptedSession.value, {
            password: process.env.WORKOS_COOKIE_PASSWORD!,
        });

        if (session && session.user && session.user.email) {
            const user = (await UserModel.findOne({
                email: session.user.email,
            }).lean()) as unknown as TUser;

            if (!user) {
                console.log("User not found in the database");
                return null;
            }
            const plainUser: TUser = {
                _id: user?._id.toString(),
                name: user.name ?? "",
                email: user.email ?? "",
                avatar: user.avatar ?? "",
                public_id: user.public_id ?? "",
                followers: (user.followers ?? []).map((id: string) =>
                    id.toString()
                ),
                followings: (user.followings ?? []).map((id: string) =>
                    id.toString()
                ),
                is_following: undefined,
                total_followers: user.followers.length,
                total_followings: user.followings.length,
                my_user_id: user?._id.toString(),
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString(),
            };
            return plainUser;
        }
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
}
