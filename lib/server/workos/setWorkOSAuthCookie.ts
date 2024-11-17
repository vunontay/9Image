import "server-only";
import type { User } from "@workos-inc/node";
import { sealData } from "iron-session";
import { cookies } from "next/headers";
import { cookieName, cookieOptions } from "@/lib/server/workos/cookie";

interface Impersonator {
    email: string;
    reason: string | null;
}

export interface Session {
    accessToken: string;
    refreshToken: string;
    user: User;
    impersonator?: Impersonator;
}

async function encryptSession(session: Session) {
    return await sealData(session, {
        password: process.env.WORKOS_COOKIE_PASSWORD!,
    });
}

export async function setWorkOSAuthCookie(sessionData: Session) {
    const session = await encryptSession(sessionData);
    const cookieStore = await cookies();
    cookieStore.set(cookieName, session, cookieOptions);
}
