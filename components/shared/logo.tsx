import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/logo/icons8-image-arcade-96.png";
import { cn } from "@/lib/utils";

interface IMainLogo {
    className?: string;
}

const MainLogo = ({ className }: IMainLogo) => {
    return (
        <Link
            href="/"
            className={cn(
                "text-primary text-2xl lg:text-4xl font-bold flex items-center",
                className
            )}
        >
            <Image
                className="size-10 mr-1"
                src={LogoImage}
                alt="logo"
                priority
                placeholder="blur"
                sizes="(max-width:50px) 2vw"
            />
            <p className="font-semibold">
                <strong className="text-foreground">9</strong>Image
            </p>
        </Link>
    );
};

MainLogo.displayName = "MainLogo";

export { MainLogo };
