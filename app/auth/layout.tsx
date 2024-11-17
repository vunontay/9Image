export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="h-[100vh]">{children}</main>
        </>
    );
}
