"use server";

import { handleWorkOSError } from "@/lib/server/workos/handleWorkOSError";
import { z } from "zod";
import workos from "@/lib/server/workos/workos";

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
    firstName: z.string(),
    lastName: z.string(),
});
export async function signUp(_: unknown, formData: FormData) {
    try {
        // For the sake of simplicity, we directly return the user here.
        // In a real application, you would probably redirect the user to sign-in.
        const { email, password, firstName, lastName } = formDataSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
        });

        const user = await workos.userManagement.createUser({
            firstName,
            lastName,
            email,
            password,
        });

        // Sign in after creating the account is required
        await workos.userManagement.authenticateWithPassword({
            email,
            password,
            clientId: process.env.WORKOS_CLIENT_ID!,
            userAgent: user.id,
        });
    } catch (error) {
        return handleWorkOSError(error);
    }
}
