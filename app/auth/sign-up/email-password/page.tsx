import Image from "next/image";
import AuthBanner from "@/assets/banner/auth-banner.webp";
import { SignUpWithEmailPasswordForm } from "@/app/auth/sign-up/email-password/components/email-password.-form";

export default function SignUpWithEmailPassword() {
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

            <SignUpWithEmailPasswordForm />
        </section>
    );
}
