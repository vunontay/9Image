import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="px-4 py-16 mx-auto text-center lg:px-8 lg:py-48 max-w-7xl sm:px-6">
                <div className="space-y-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        <span className="block">404</span>
                        <span className="block text-primary">
                            Page Not Found
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Oops! The page you are looking for might have been
                        removed, had its name changed, or is temporarily
                        unavailable.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Button asChild>
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Home Page
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
