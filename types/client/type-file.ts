import { StaticImageData } from "next/image";

export type TFileResult = {
    name?: string;
    status: "success" | "error";
    message?: string;
    title: string;
    imgUrl: string | StaticImageData;
    tags?: string[];
    public?: boolean;
    fileUpload?: File;
};
