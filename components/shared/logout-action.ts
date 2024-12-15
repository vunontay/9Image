"use server";

import { cookieName } from "@/lib/server/workos/cookie";
import { cookies } from "next/headers";

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(cookieName);
        return { success: true, message: "Logout successful" };
    } catch {
        return { success: false, message: "Logout failed" };
    }
}
