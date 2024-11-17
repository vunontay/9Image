"use server";

import { cookieName } from "@/lib/server/workos/cookie";
import { cookies } from "next/headers";
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);

    return {
        success: true,
        message: "Logged out successfully",
    };
}
