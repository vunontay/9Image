"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorDisplay } from "@/components/auth/error-display";
import { signIn } from "@/app/auth/sign-in/email-password/email-password";
import { LoadingButton } from "@/components/custom/loading-button";
import Link from "next/link";
import Form from "next/form";
import { PasswordInput } from "@/components/custom/password-input";

export function SignInWithEmailPasswordForm() {
    const [signInState, signInAction, isPending] = useActionState(signIn, null);

    return (
        <>
            <Form
                action={signInAction}
                className="grid gap-4"
                id="login-password-form"
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

                <LoadingButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Signing In..."
                    className="w-full sm:w-auto min-w-[120px] transition-all duration-200 hover:scale-102"
                >
                    Sign In
                </LoadingButton>
            </Form>
            {signInState == null ? null : <ErrorDisplay error={signInState} />}
            <div className="text-center text-sm font-semibold">
                Don&apos;t have an account?{" "}
                <Link
                    className="underline text-primary"
                    href={"/auth/sign-up/email-password"}
                >
                    Register
                </Link>
            </div>
        </>
    );
}
