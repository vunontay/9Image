export type TUser = {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    followers: string[];
    followings: string[];
    createdAt: string;
    updatedAt: string;
    is_following: boolean | undefined;
    total_followers: number;
    total_followings: number;
    my_user_id: string;
    public_id: string;
};
