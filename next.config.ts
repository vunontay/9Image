import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    swcMinify: true,
    // compiler: {
    //     removeConsole: process.env.NODE_ENV === "production",
    // },
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
