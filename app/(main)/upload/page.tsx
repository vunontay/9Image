import { Upload } from "@/app/(main)/upload/(form)/_components/upload";
import { H1, H2, H3 } from "@/components/shared/title";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Creative Upload Platform",
        default: "Upload Multimedia Content | Creative Community",
    },
    description:
        "Join our community of creators and showcase your unique multimedia content. Share your photos and videos with the world!",
    keywords: [
        "upload multimedia",
        "share content",
        "photos",
        "videos",
        "creativity",
        "community",
        "creators",
    ],
    // openGraph: {
    //     title: "Upload Multimedia Content | Creative Community",
    //     description:
    //         "Show off your creativity by uploading your photos and videos to our community platform. Let the world appreciate your art!",
    //     url: "https://yourwebsite.com/upload",
    //     siteName: "Creative Community",
    //     images: [
    //         {
    //             url: "/images/og-upload.jpg", // replace with your Open Graph image URL
    //             width: 1200,
    //             height: 630,
    //             alt: "Creative Community Upload Page",
    //         },
    //     ],
    //     type: "website",
    // },
    // twitter: {
    //     card: "summary_large_image",
    //     title: "Upload Your Creative Multimedia Content",
    //     description:
    //         "Join our community and showcase your creative photos and videos to the world!",
    //     images: ["/images/twitter-upload.jpg"], // replace with your Twitter image URL
    // },
};

export default function UploadPage() {
    return (
        <div className="text-center">
            <H1
                title="Upload multimedia content"
                className="text-2xl font-bold py-2 md:py-4"
            />
            <H2
                title="Join our community of creators and show off your creativity by uploading your own multimedia content!"
                className="text-muted-foreground"
            />
            <H3
                title="Share your photos and videos, and let the world love them."
                className="text-muted-foreground"
            />
            <Upload />
        </div>
    );
}
