"use client";

import { Clock, Flame, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sortOptions = [
    {
        value: "newest",
        label: "Newest",
        icon: Clock,
    },
    {
        value: "popular",
        label: "Popular",
        icon: Flame,
    },
    {
        value: "trending",
        label: "Trending",
        icon: Sparkles,
    },
];

const OrderButton = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", value);
        router.push(`/?${params.toString()}`);
        router.refresh();
    };

    return (
        <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

OrderButton.displayName = "OrderButton";
export { OrderButton };
