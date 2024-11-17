import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: "%s | 9Image",
        default: "9Image",
    },
    description:
        "Explore a wide variety of high-quality images curated for visual enthusiasts and power users.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${roboto.className} antialiased `}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" expand={false} richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
