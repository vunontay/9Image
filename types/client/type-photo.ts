type TUser = {
    _id: string;
    name: string;
    avatar: string | null;
};

export type TPhotoData = {
    _id: string;
    title: string;
    slug: string;
    public_id: string;
    imgUrl: string;
    imgName: string;
    blurHash: string;
    tags: string[];
    public: boolean;
    user: TUser;
    __v: number;
    createdAt: string;
    updatedAt: string;
    is_favorite: boolean;
    total_favorite: number;
    my_user_id: string;
};

export type TPhotoDataResponse = {
    photos: TPhotoData[] | null;
    nextCursor: string | number;
};
