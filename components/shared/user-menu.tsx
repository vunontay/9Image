"use client";

import { SearchForm } from "@/components/search/search-form";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import {
    Check,
    LogOutIcon,
    Menu,
    Monitor,
    Moon,
    Palette,
    Sun,
    Upload,
    UserIcon,
} from "lucide-react";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Form from "next/form";

import { MainLogo } from "@/components/shared/logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { H3 } from "@/components/shared/title";
import { TUser } from "@/types/client/type-user";
import { logout } from "@/components/shared/logout-action";
import { toast } from "sonner";

interface IUserMenu {
    className?: string;
    "aria-label"?: string;
    tabIndex?: number;
    user?: TUser | null;
}

const LoginButton = ({ className }: IUserMenu) => {
    return (
        <Link href={"/auth/sign-in/email-password"} className={className}>
            <Button variant={"outline"} size={"default"}>
                Sign In
            </Button>
        </Link>
    );
};

const LogoutButton = ({ className }: IUserMenu) => {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await logout();
        if (response && response.success) {
            toast.success(response.message);
            router.refresh();
        } else {
            toast.error("Logout failed!");
        }
    };

    return (
        <Form className={className} action={handleLogout}>
            <Button type="submit">
                <LogOutIcon className={"mr-2 size-4"} />
                logout
            </Button>
        </Form>
    );
};

const UploadButton = ({ className, user }: IUserMenu) => {
    const router = useRouter();
    const handleRedirectUpload = () => {
        if (!user) {
            toast.warning("User not logged in");
        } else {
            router.push("/upload");
        }
    };

    return (
        <div className={className} onClick={handleRedirectUpload}>
            <Button variant={"outline"} size={"default"}>
                Upload <Upload />
            </Button>
        </div>
    );
};

const MenubarButton = ({ className }: IUserMenu) => {
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        className={className}
                        variant={"outline"}
                        size={"icon"}
                    >
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side={"left"} className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle className="border-b pb-2">
                            <MainLogo />
                        </SheetTitle>
                    </SheetHeader>
                    <div className="h-full">
                        <H3
                            title="Search for free photos"
                            className="text-xl font-semibold py-2 mt-4 text-center"
                        />
                        <SearchForm />

                        <div className="absolute w-full bottom-4 px-6 pt-2 left-0 border-t">
                            <div className="flex items-center justify-end gap-2 sm:gap-2">
                                <LoginButton />
                                <UploadButton />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

const UserButton = ({ className, user }: IUserMenu) => {
    const { theme, setTheme } = useTheme();

    const router = useRouter();

    const switchLanguage = (lang: string) => {
        router.push(`/${lang}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("flex-none rounded-full ", className)}>
                    <UserAvatar
                        avatarUrl={user?.avatar}
                        className="shadow-md"
                        size={40}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="py-2">
                    {user?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/profile/${user?._id}`}>
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 size-4" />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2">
                        <Palette className="mr-2 size-4" />
                        Theme
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                <Monitor className="mr-2 size-4" />
                                System
                                {theme === "system" && (
                                    <Check className="ms-2 size-4" />
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 size-4" />
                                Light
                                {theme === "light" && (
                                    <Check className="ms-2 size-4" />
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 size-4" />
                                Dark
                                {theme === "dark" && (
                                    <Check className="ms-2 size-4" />
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2">
                        <span className="mr-2 size-4">🌐</span> Language
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem
                                onClick={() => switchLanguage("en")}
                            >
                                <span>English</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => switchLanguage("vi")}
                            >
                                <span>Tiếng Việt</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

UserButton.displayName = "UserButton";
LoginButton.displayName = "LoginButton";
UploadButton.displayName = "UploadButton";
MenubarButton.displayName = "MenubarButton";
LogoutButton.displayName = "LogoutButton";
export { UserButton, LoginButton, UploadButton, MenubarButton, LogoutButton };
