import Image from "next/image";
import avatarPlaceholder from "@/assets/avatar-image.webp";
import { cn } from "@/lib/utils";

interface IUserAvatar {
    avatarUrl: string | null | undefined;
    size?: number;
    className?: string;
}

const UserAvatar = ({ avatarUrl, size, className }: IUserAvatar) => {
    return (
        <Image
            src={avatarUrl || avatarPlaceholder}
            alt="User avatar"
            width={size ?? 48}
            height={size ?? 48}
            className={cn(
                "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
                className
            )}
            sizes="(max-width:50px) 2vw"
        />
    );
};

UserAvatar.displayName = "UserAvatar";

export { UserAvatar };
