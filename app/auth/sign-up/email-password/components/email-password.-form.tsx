"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorDisplay } from "@/components/auth/error-display";
import { signUp } from "@/app/auth/sign-up/email-password/email-password";
import { LoadingButton } from "@/components/custom/loading-button";
import Link from "next/link";
import Form from "next/form";
import { EmailVerificationForm } from "@/app/auth/sign-up/email-password/components/email-verifycation-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ClipboardPen } from "lucide-react";
import { PasswordInput } from "@/components/custom/password-input";

export function SignUpWithEmailPasswordForm() {
    const [signUpState, signUpAction, isPending] = useActionState(signUp, null);

    if (
        signUpState != null &&
        signUpState.code === "email_verification_required" &&
        signUpState.pendingAuthenticationToken != null
    ) {
        return (
            <EmailVerificationForm
                email={signUpState.email}
                pendingAuthenticationToken={
                    signUpState.pendingAuthenticationToken
                }
            />
        );
    }
    return (
        <>
            <div className="flex justify-center items-center">
                <Card className="mx-auto w-96">
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between items-center mb-2">
                            Sign Up <ClipboardPen />
                        </CardTitle>
                        <CardDescription>
                            Create a new account to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Form
                            action={signUpAction}
                            className="grid gap-4"
                            id="register-password-form"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoCapitalize="off"
                                    autoComplete="username"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    name="password"
                                    id="password"
                                    autoCapitalize="off"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    autoComplete="family-name"
                                />
                            </div>

                            <LoadingButton
                                type="submit"
                                isLoading={isPending}
                                loadingText="Signing Up..."
                                className="w-full sm:w-auto min-w-[120px] transition-all duration-200 hover:scale-102"
                            >
                                Sign Up
                            </LoadingButton>
                        </Form>
                        {signUpState == null ? null : (
                            <ErrorDisplay error={signUpState} />
                        )}
                        <div className="text-center text-sm font-semibold">
                            Already have an account?{" "}
                            <Link
                                className="underline text-primary"
                                href="/auth/sign-in/email-password"
                            >
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
