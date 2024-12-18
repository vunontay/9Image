"use client";

import { H1 } from "@/components/shared/title";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { TUser } from "@/types/client/type-user";
import { formatNumber } from "@/utils/format-number";
import Link from "next/link";
import { useState } from "react";
import { Mail, Edit, UserPlus } from "lucide-react";
import { EditModal } from "@/components/profile/edit-modal";
import { toast } from "sonner";
import { followerUser } from "@/actions/user-action";
import { LogoutButton } from "@/components/shared/user-menu";

interface IProfileDetail {
    data: TUser;
}

const ProfileDetail = ({ data }: IProfileDetail) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(
        data.is_following || false
    );
    const [totalFollowers, setTotalFollowers] = useState(data.total_followers);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleFollowToggle = async () => {
        // Toggle the following state and adjust follower count
        if (!data.my_user_id) {
            toast.warning("User not logged in");
        } else {
            setIsFollowing((prev) => !prev);
            setTotalFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
            await followerUser({ ...data, isFollowing });
        }
    };

    const handleOpenModal = () => {
        setIsEdit(true);
    };

    const handleCloseModal = () => {
        setIsEdit(false);
    };
    return (
        <>
            {/* -----------------------------------------EDIT PROFILE MODAL-------------------------------------- */}
            <EditModal data={data} isOpen={isEdit} onClose={handleCloseModal} />

            <Card className="w-full mx-auto bg-secondary">
                <div className="flex flex-col gap-4 pb-2">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <UserAvatar
                            avatarUrl={data.avatar}
                            size={100}
                            className="border-4 border-white shadow-md"
                        />
                        <div className="flex flex-col">
                            <H1
                                title={data.name}
                                className="text-2xl font-bold"
                            />
                            <div className="flex items-center text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{data.email}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`/profile/${data._id}/follower`}
                                    className="flex items-center gap-2 text-sm text-foreground"
                                >
                                    <strong>
                                        {formatNumber(totalFollowers)}{" "}
                                    </strong>
                                    <span>Followers</span>
                                </Link>
                                <Link
                                    href={`/profile/${data._id}/following`}
                                    className="flex items-center gap-2 text-sm text-foreground"
                                >
                                    <strong>
                                        {formatNumber(data.total_followings)}{" "}
                                    </strong>
                                    <span>Followings</span>
                                </Link>
                            </div>

                            {/* Check if the logged-in user is viewing their own profile */}
                            {data._id === data.my_user_id ? (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleOpenModal}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {" "}
                                        Edit Profile
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <LogoutButton />
                                </div>
                            ) : (
                                <Button
                                    className="max-w-32"
                                    variant={
                                        isFollowing ? "outline" : "default"
                                    }
                                    onClick={handleFollowToggle}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserPlus className="size-4" />
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="size-4" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>
        </>
    );
};

ProfileDetail.displayName = "ProfileDetail";
export { ProfileDetail };
