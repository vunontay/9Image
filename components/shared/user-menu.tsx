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
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    Check,
    LogOutIcon,
    Menu,
    Moon,
    Palette,
    Sun,
    Upload,
    UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { MainLogo } from "@/components/shared/logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { H3 } from "@/components/shared/title";
import { TUser } from "@/types/client/type-user";
import { logout } from "@/components/shared/logout-action";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import Form from "next/form";

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

const LogoutButton = ({ className, ...props }: IUserMenu) => {
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
        <Form action={handleLogout}>
            <Button
                {...props}
                className={cn("w-full gap-2", className)}
                type="submit"
                variant="outline"
                size="sm"
            >
                Logout
                <LogOutIcon className={"size-4"} />
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

const MenubarButton = ({ className, user }: IUserMenu) => {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const switchLanguage = (lang: string) => {
        router.push(`/${lang}`);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className={className} variant="outline" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
                <SheetHeader className="px-4 py-2">
                    <SheetTitle className="border-b pb-2">
                        <MainLogo />
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col ">
                    <div className="flex-1 overflow-y-auto px-4">
                        <H3
                            title="Search for free photos"
                            className="text-xl font-semibold py-2 mt-4 text-center"
                        />
                        <SearchForm />

                        {/* Theme Switcher */}
                        <div className="mt-4 px-2">
                            <h4 className="mb-2 text-sm font-medium">Theme</h4>
                            <div className="flex gap-2">
                                <Button
                                    variant={
                                        theme === "light"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setTheme("light")}
                                    className="w-24"
                                >
                                    <Sun className="size-4" />
                                    Light
                                </Button>
                                <Button
                                    variant={
                                        theme === "dark" ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setTheme("dark")}
                                    className="w-24"
                                >
                                    <Moon className="size-4" />
                                    Dark
                                </Button>
                            </div>
                        </div>

                        {/* Language Switcher */}
                        <div className="mt-4 px-2">
                            <h4 className="mb-2 text-sm font-medium">
                                Language
                            </h4>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => switchLanguage("en")}
                                    className="w-24"
                                >
                                    🇺🇸 English
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => switchLanguage("vi")}
                                    className="w-24"
                                >
                                    🇻🇳 Tiếng Việt
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto border-t p-4 bg-background absolute bottom-[30%] w-full">
                    <div className="flex items-center  gap-2">
                        {user ? (
                            <>
                                <Link href={`/profile/${user._id}`}>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                    >
                                        Profile
                                        <UserIcon className="size-4" />
                                    </Button>
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <LoginButton />
                                <UploadButton user={user} />
                            </div>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
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
                    <LogoutButton className="w-full" />
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
