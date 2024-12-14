import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getPhotoById } from "@/actions/photos-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhotoActions } from "./_components/photo-actions";

export default async function PhotoDetailPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;
    const { data: photo } = await getPhotoById(id);

    if (!photo) {
        notFound();
    }

    return (
        <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Image Section */}
            <div className="lg:col-span-4 space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-gray-50">
                    <Image
                        src={photo.imgUrl}
                        alt={photo.title}
                        fill
                        priority
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL={photo.blurHash}
                    />
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-4 lg:self-start">
                {/* User Info */}
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <Link
                        href={`/profile/${photo.user._id}`}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    >
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage
                                src={photo.user.avatar || ""}
                                alt={photo.user.name}
                            />
                            <AvatarFallback>
                                {photo.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium">@{photo.user.name}</h3>
                            <p className="text-sm text-gray-500">
                                Author
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Photo Info */}
                <div className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
                    <div>
                        <h2 className="font-semibold text-xl mb-2">
                            {photo.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Published on {formatDate(photo.createdAt)}
                        </p>
                    </div>

                    <PhotoActions photo={photo} />

                    <div>
                        <h3 className="font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {photo.tags.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="hover:bg-secondary/80 cursor-pointer"
                                >
                                    <Link href={`/search/photos/${tag}`}>
                                        #{tag}
                                    </Link>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Details */}
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <h3 className="font-medium mb-3">Image Details</h3>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Type</dt>
                            <dd className="font-medium">
                                {photo.imgName.split(".").pop()?.toUpperCase()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Visibility</dt>
                            <dd className="font-medium">
                                {photo.public ? "Public" : "Private"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

// Tối ưu hóa với generateMetadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;
    const { data: photo } = await getPhotoById(id);

    return {
        title: photo?.title || "Photo Detail",
        description: `Photo by ${photo?.user.name}`,
        openGraph: {
            images: [photo?.imgUrl],
        },
    };
}
