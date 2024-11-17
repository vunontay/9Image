import { verifyEmailWithCode } from "@/app/auth/sign-up/email-password/email-verify";
import { ErrorDisplay } from "@/components/auth/error-display";
import { SuccessDisplay } from "@/components/auth/success-display";
import { LoadingButton } from "@/components/custom/loading-button";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import React, { useActionState } from "react";

interface IEmailVerificationForm {
    pendingAuthenticationToken: string;
    email: string;
}

const OTPLength = 6;

export function EmailVerificationForm({
    pendingAuthenticationToken,
    email,
}: IEmailVerificationForm) {
    const [verifyEmailWithCodeState, verifyEmailWithCodeAction, isPending] =
        useActionState(verifyEmailWithCode, null);

    const handleBackToSignUp = () => {
        window.location.reload();
    };

    return (
        <div className="flex justify-center items-center">
            <Card className="mx-auto w-96">
                <CardHeader>
                    <CardTitle className="text-2xl flex justify-between items-center mb-2">
                        Verify Your Email <ShieldCheck />
                    </CardTitle>
                    <CardDescription>
                        We sent you a one-time password to {email}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Form
                        action={verifyEmailWithCodeAction}
                        className="grid gap-4"
                        id="verify-email-form"
                    >
                        <input
                            type="hidden"
                            name="pendingAuthenticationToken"
                            value={pendingAuthenticationToken}
                            readOnly
                        />
                        <input
                            type="hidden"
                            name="email"
                            value={email}
                            readOnly
                        />
                        <div className="flex justify-center">
                            <InputOTP maxLength={OTPLength} name="code">
                                <InputOTPGroup>
                                    {Array.from({ length: OTPLength }).map(
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                            />
                                        )
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <LoadingButton
                            type="submit"
                            isLoading={isPending}
                            loadingText="Verifying..."
                            className="w-full sm:w-auto min-w-[120px] transition-all duration-200 hover:scale-102"
                        >
                            Verify Email
                        </LoadingButton>
                    </Form>
                    {verifyEmailWithCodeState &&
                    "success" in verifyEmailWithCodeState ? (
                        <SuccessDisplay message="Email verified successfully!" />
                    ) : verifyEmailWithCodeState ? (
                        <ErrorDisplay error={verifyEmailWithCodeState} />
                    ) : null}

                    {verifyEmailWithCodeState &&
                    "success" in verifyEmailWithCodeState ? (
                        <div className="text-center text-sm font-semibold">
                            Email verified successfully! Proceed to{" "}
                            <Link
                                className="underline text-primary"
                                href="/auth/sign-in/email-password"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center text-sm font-semibold">
                            Want to register with a different email?{" "}
                            <Button
                                onClick={handleBackToSignUp}
                                className="p-0"
                                variant={"link"}
                            >
                                Register Again
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
