// src/components/user-profile.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

interface UserProfileProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function UserProfile({ user }: UserProfileProps) {
    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    // Get initials for the avatar fallback
    const getInitials = () => {
        if (!user.name) return "U";
        return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        {user.image ? (
                            <AvatarImage src={user.image} alt={user.name || "User"} />
                        ) : (
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name || "User"}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </CardContent>
        </Card>
    );
}