import Image from "next/image";
import AuthBanner from "@/assets/banner/auth-banner.webp";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SignInWithEmailPasswordForm } from "@/app/auth/sign-in/email-password/components/email-password.-form";
import { LogIn } from "lucide-react";
export default function SignInWithEmailPassword() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
            <div className="hidden md:block relative">
                <Image
                    alt="auth-banner"
                    src={AuthBanner}
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>

            <div className="flex justify-center items-center">
                <Card className="mx-auto w-96">
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between items-center mb-2">
                            Welcome back. <LogIn />
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <SignInWithEmailPasswordForm />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
