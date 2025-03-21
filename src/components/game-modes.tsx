"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Bot } from "lucide-react";
import { createGame } from "@/lib/actions/game-actions";
import { createAIGame } from "@/lib/actions/ai-actions";

interface GameModesProps {
    userId: string;
}

export default function GameModes({ userId }: GameModesProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleCreateGame(type: string) {
        setIsLoading(type);
        setError(null);

        try {
            console.log("Creating game with userId:", userId); // Debug log

            if (!userId) {
                setError("User ID is missing. Please try logging out and logging back in.");
                setIsLoading(null);
                return;
            }

            if (type === "ai") {
                const game = await createAIGame(userId);
                router.push(`/game/${game.id}`);
            } else {
                const game = await createGame(userId);
                router.push(`/game/${game.id}`);
            }
        } catch (error) {
            console.error("Failed to create game:", error);
            setError("Failed to create game. Please try again.");
            setIsLoading(null);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {error && (
                <div className="md:col-span-3 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
                    {error}
                </div>
            )}

            <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle>Play vs Friend</CardTitle>
                    <CardDescription>Create a game and invite a friend to play</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => handleCreateGame("friend")}
                        disabled={isLoading !== null}
                        className="w-full"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        {isLoading === "friend" ? "Creating..." : "New Game"}
                    </Button>
                </CardContent>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </Card>

            <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle>Play vs AI</CardTitle>
                    <CardDescription>Challenge our AI to a quick game</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => handleCreateGame("ai")}
                        disabled={isLoading !== null}
                        className="w-full"
                    >
                        <Bot className="mr-2 h-4 w-4" />
                        {isLoading === "ai" ? "Creating..." : "Start Now"}
                    </Button>
                </CardContent>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </Card>

            <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle>Game History</CardTitle>
                    <CardDescription>View your past games and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/games")}
                        className="w-full"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Your Games
                    </Button>
                </CardContent>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </Card>
        </div>
    );
}