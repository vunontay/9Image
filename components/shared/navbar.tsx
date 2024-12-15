import { SearchForm } from "@/components/search/search-form";
import { MainLogo } from "@/components/shared/logo";
import {
    LoginButton,
    MenubarButton,
    UploadButton,
    UserButton,
} from "@/components/shared/user-menu";
import { getUser } from "@/lib/server/workos/session";

const Navbar = async () => {
    const user = await getUser();

    return (
        <header className="sticky top-0 z-10 bg-card shadow-md">
            <div className="container mx-auto flex items-center justify-between gap-2 px-4 sm:px-8 py-2 sm:gap-4 sm:py-4 lg:gap-8">
                <div className="flex items-center gap-8">
                    <MainLogo />
                    <SearchForm className="hidden lg:flex" />
                </div>
                <nav className="flex items-center gap-2 sm:gap-2">
                    <MenubarButton
                        className="lg:hidden"
                        aria-label="Open menu"
                        tabIndex={0}
                    />

                    {user ? (
                        <UserButton user={user} className="hidden lg:block" />
                    ) : (
                        <LoginButton />
                    )}

                    <UploadButton
                        user={user}
                        className="hidden lg:block ml-2"
                    />
                </nav>
            </div>
        </header>
    );
};

Navbar.displayName = "Navbar";
export { Navbar };
