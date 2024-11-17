export const cookieName = "wos-session";
export const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
};
