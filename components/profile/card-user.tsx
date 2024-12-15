"use client";
import { followerUser } from "@/actions/user-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUser } from "@/types/client/type-user";
import {
    EllipsisVertical,
    User,
    UserRoundCheck,
    UserRoundMinus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ICardUser {
    user: TUser;
}

const CardUserComponent = ({ user }: ICardUser) => {
    const router = useRouter();

    const [isFollowing, setIsFollowing] = useState<boolean>(
        user.is_following || false
    );

    const handleFollowToggle = async () => {
        if (!user.my_user_id) {
            toast.warning("User not logged in");
            return;
        }
        if (user.my_user_id === user._id) {
            toast.warning("You cannot follow yourself");
            return;
        }

        setIsFollowing((prev) => !prev);

        await followerUser({ ...user, isFollowing });
        router.refresh();
    };

    return (
        <>
            <Card key={user._id} className="w-full">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                                sizes="25vw"
                            />
                            <AvatarFallback>
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>All action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User />{" "}
                                <Link href={`/profile/${user._id}`}>
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleFollowToggle}>
                                {isFollowing ? (
                                    <UserRoundMinus />
                                ) : (
                                    <UserRoundCheck />
                                )}
                                {isFollowing ? "Unfollow" : "Follow"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </Card>
        </>
    );
};

CardUserComponent.displayName = "CardUser";
const CardUser = React.memo(CardUserComponent);
export { CardUser };
