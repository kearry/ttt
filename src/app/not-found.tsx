// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
                <Link href="/">
                    Go Home
                </Link>
            </Button>
        </div>
    );
}