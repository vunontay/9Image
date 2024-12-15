"use server";

import { cookieName } from "@/lib/server/workos/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(cookieName);
        redirect("/");
    } catch {
        return { success: false, message: "Logout failed" };
    }
}
