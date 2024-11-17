"use server";

import { handleWorkOSError } from "@/lib/server/workos/handleWorkOSError";
import { setWorkOSAuthCookie } from "@/lib/server/workos/setWorkOSAuthCookie";
import { z } from "zod";
import workos from "@/lib/server/workos/workos";
import { redirect } from "next/navigation";

// These are Next.js server actions.
//
// If your application is a single page app (SPA) with a separate backend you will need to:
// - create a backend endpoint to handle each request
// - adapt the code below in each of those endpoints
//
// Please also note that for the sake of simplicity, we return all errors here.
// In a real application, you should pay attention to which errors make it
// to the client for security reasons.

const formDataSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function signIn(_: unknown, formData: FormData) {
    try {
        // For the sake of simplicity, we directly return the user here.
        // In a real application, you would probably store the user in a token (JWT)
        // and store that token in your DB or use cookies.

        const { email, password } = formDataSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        const user = await workos.userManagement.authenticateWithPassword({
            clientId: process.env.WORKOS_CLIENT_ID || "",
            email,
            password,
        });

        await setWorkOSAuthCookie(user);
    } catch (error) {
        return handleWorkOSError(error);
    }
    redirect("/");
}
