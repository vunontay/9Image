import { Navbar } from "@/components/shared/navbar";
export const dynamic = "force-dynamic";
export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className=" container mx-auto px-4 sm:px-8 py-2 sm:py-4 ">
                {children}
            </main>
        </>
    );
}
