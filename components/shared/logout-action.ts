"use server";

import { cookieName } from "@/lib/server/workos/cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(cookieName);

        return {
            success: true,
            message: "Logged out successfully",
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error("An error occurred");
    } finally {
        revalidatePath("/");
    }
}
