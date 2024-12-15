export const optimizeImageUrl = (url: string) => {
    if (!url) return url;
    // Add Cloudinary optimization parameters
    return url.replace("/upload/", "/upload/q_auto,f_auto,w_800/");
};
