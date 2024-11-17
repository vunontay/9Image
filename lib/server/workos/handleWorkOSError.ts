import { ZodError, z } from "zod";

const emailVerificationErrorSchema = z.object({
    status: z.number(),
    rawData: z.object({
        code: z.literal("email_verification_required"),
        message: z.string(),
        email: z.string().email(),
        pending_authentication_token: z.string(),
    }),
    requestID: z.string(),
    name: z.string(),
    message: z.string(),
});

const genericWorkOSErrorSchema = z.object({
    status: z.number(),
    rawData: z.object({
        code: z.string(),
        message: z.string(),
    }),
    requestID: z.string(),
    name: z.string(),
    message: z.string(),
});

const userCreationErrorSchema = z.object({
    status: z.number(),
    requestID: z.string(),
    code: z.string(), //"user_creation_error", "password_strength_error", "password_reset_error"
    errors: z.array(
        z.object({
            code: z.string(),
            message: z.string(),
        })
    ),
});

export type WorkOSError = ReturnType<typeof handleWorkOSError>;

export function handleWorkOSError(error: unknown) {
    if (error instanceof ZodError) {
        return {
            code: "zod_error",
            errors: error.errors.map((e) => {
                return {
                    code: e.code,
                    message: e.message,
                };
            }),
        };
    }

    const safeParsedEmailVerificationRequiredError =
        emailVerificationErrorSchema.safeParse(error);
    if (safeParsedEmailVerificationRequiredError.success) {
        return {
            code: safeParsedEmailVerificationRequiredError.data.rawData.code,
            error: safeParsedEmailVerificationRequiredError.data.message,
            email: safeParsedEmailVerificationRequiredError.data.rawData.email,
            pendingAuthenticationToken:
                safeParsedEmailVerificationRequiredError.data.rawData
                    .pending_authentication_token,
        };
    }

    const safeParsedUserCreationError =
        userCreationErrorSchema.safeParse(error);
    if (safeParsedUserCreationError.success) {
        return {
            code: safeParsedUserCreationError.data.code,
            errors: safeParsedUserCreationError.data.errors,
        };
    }

    const safeParsedGenericWorkOSError =
        genericWorkOSErrorSchema.safeParse(error);
    if (safeParsedGenericWorkOSError.success) {
        return {
            code: safeParsedGenericWorkOSError.data.rawData.code,
            error: safeParsedGenericWorkOSError.data.message,
        };
    }

    return {
        error: JSON.stringify(error),
        code: "unknown",
    };
}
