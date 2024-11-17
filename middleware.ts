import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("wos-session");

    if (sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/sign-in/email-password", "/auth/sign-up/email-password"],
};
