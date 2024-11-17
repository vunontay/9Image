import { Input } from "@/components/ui/input";
import {
    FolderClosed,
    Image as ImageIcon,
    SearchIcon,
    SquareUserRound,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { cn } from "@/lib/utils";

interface ISearchForm {
    className?: string;
}

const SearchForm = ({ className }: ISearchForm) => {
    return (
        <Form action="/search/photos">
            <div className={cn("flex items-center", className)}>
                <div>
                    <Select name="type" defaultValue="photos">
                        <SelectTrigger className="min-w-36 text-sm font-medium border-r rounded-r-none focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Search type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="photos">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Photos</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="collections">
                                <div className="flex items-center gap-2">
                                    <FolderClosed className="w-4 h-4" />
                                    <span>Collections</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="users">
                                <div className="flex items-center gap-2">
                                    <SquareUserRound className="w-4 h-4" />
                                    <span>Users</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative">
                    <Input
                        name="query"
                        placeholder="Search image..."
                        className="pe-10 border-l-0 rounded-l-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        type="submit"
                        variant="default"
                        className="absolute right-2 top-1/2 w-10 h-8 -translate-y-1/2 transform rounded-sm"
                    >
                        <SearchIcon />
                    </Button>
                </div>
            </div>
        </Form>
    );
};

SearchForm.displayName = "SearchForm";

export { SearchForm };
