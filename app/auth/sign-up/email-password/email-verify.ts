"use server";

import mongooseConnect from "@/lib/server/mongoose/mongoose";
import { handleWorkOSError } from "@/lib/server/workos/handleWorkOSError";
import workos from "@/lib/server/workos/workos";
import UserModel from "@/models/user-model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema to validate input data
const verifyEmailWithCodeSchema = z.object({
    code: z.string().length(6),
    email: z.string().email(),
});

// Action to handle OTP verification
export async function verifyEmailWithCode(_: unknown, formData: FormData) {
    try {
        await mongooseConnect();
        // Validate data from the form
        const { code, email } = verifyEmailWithCodeSchema.parse({
            pendingAuthenticationToken: formData.get(
                "pendingAuthenticationToken"
            ),
            code: formData.get("code"),
            email: formData.get("email"),
        });

        const users = await workos.userManagement.listUsers({
            email: email,
        });
        const user = users.data[0];

        // Call the WorkOS API to verify the OTP code
        const response = await workos.userManagement.verifyEmail({
            userId: user.id,
            code,
        });

        // Check if the user already exists in MongoDB
        let existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            // If the user doesn't exist, create a new user
            existingUser = new UserModel({
                name: response.user.firstName + " " + response.user.lastName,
                email: response.user.email,
                avatar: response.user.profilePictureUrl,
            });
            await existingUser.save();
            console.log("New user created");
        } else {
            console.log("User already exists, skipping creation");
        }

        // Return success result for verification
        revalidatePath("/auth/sign-up/email-password");
        return {
            success: true,
            message: "Email verified successfully",
            user: response.user,
        };
    } catch (error) {
        // Handle errors from WorkOS and return them for display in `ErrorDisplay`
        return handleWorkOSError(error);
    }
}
