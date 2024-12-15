import { Navbar } from "@/components/shared/navbar";

export const dynamic = "force-dynamic";
export default async function MainLayout({
    children,
    breadcrumbs,
}: {
    children: React.ReactNode;
    breadcrumbs: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {breadcrumbs}
            <main className="container mx-auto px-4 sm:px-8 py-2 sm:py-4">
                {children}
            </main>
        </>
    );
}
