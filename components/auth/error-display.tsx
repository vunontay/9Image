"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WorkOSError } from "@/lib/server/workos/handleWorkOSError";
import { AlertCircle } from "lucide-react";

interface IErrorDisplayProps {
    error: WorkOSError | null;
}

const ErrorDisplay = ({ error }: IErrorDisplayProps) => {
    if (!error) return null;

    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>
                {error.code === "zod_error" && error.errors && (
                    <ul className="list-disc pl-5">
                        {error.errors.map((e, index) => (
                            <li key={index}>{e.message}</li>
                        ))}
                    </ul>
                )}
                {error.code === "email_verification_required" &&
                    error.email && (
                        <p>
                            Email verification required for {error.email}.
                            Please check your inbox and verify your email
                            address.
                        </p>
                    )}
                {error.code === "user_creation_error" && error.errors && (
                    <ul className="list-disc pl-5">
                        {error.errors.map((e, index) => (
                            <li key={index}>{e.message}</li>
                        ))}
                    </ul>
                )}
                {error.code === "password_strength_error" && error.errors && (
                    <ul className="list-disc pl-5">
                        {error.errors.map((e, index) => (
                            <li key={index}>{e.message}</li>
                        ))}
                    </ul>
                )}
                {(error.code === "unknown" || "error" in error) && (
                    <p>
                        {error.error ||
                            "An unexpected error occurred. Please try again later."}
                    </p>
                )}
            </AlertDescription>
        </Alert>
    );
};
ErrorDisplay.displayName = "ErrorDisplay";
export { ErrorDisplay };
