"use client";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, SearchIcon, SquareUserRound } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Form from "next/form";

interface ISearchForm {
    className?: string;
}

const SearchForm = ({ className }: ISearchForm) => {
    const router = useRouter();

    const handleSearch = async (formData: FormData) => {
        const type = formData.get("type");
        const query = formData.get("query")?.toString().trim();

        if (!query) return;

        const encodedQuery = encodeURIComponent(query);
        router.push(`/search/${type}/${encodedQuery}`);
    };

    return (
        <Form action={handleSearch}>
            <div className={cn("flex items-center", className)}>
                <div>
                    <Select
                        name="type"
                        defaultValue="photos"
                        aria-label="Select search type"
                    >
                        <SelectTrigger
                            className="min-w-36 text-sm font-medium border-r rounded-r-none focus:ring-0 focus:ring-offset-0"
                            aria-label="Choose search category"
                        >
                            <SelectValue
                                placeholder="Search type"
                                aria-label="Selected search category"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="photos"
                                aria-label="Search for photos"
                            >
                                <div className="flex items-center gap-2">
                                    <ImageIcon
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                    <span>Photos</span>
                                </div>
                            </SelectItem>
                            <SelectItem
                                value="users"
                                aria-label="Search for users"
                            >
                                <div className="flex items-center gap-2">
                                    <SquareUserRound
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                    <span>Users</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative flex-grow">
                    <label htmlFor="search-input" className="sr-only">
                        Search image
                    </label>
                    <Input
                        id="search-input"
                        name="query"
                        placeholder={`Search...`}
                        className="pe-10 border-l-0 rounded-l-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                        required
                    />
                    <Button
                        type="submit"
                        variant="default"
                        className="absolute right-2 top-1/2 w-10 h-8 -translate-y-1/2 transform rounded-sm"
                        aria-label="Search"
                    >
                        <SearchIcon aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </Form>
    );
};

SearchForm.displayName = "SearchForm";

export { SearchForm };
