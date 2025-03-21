// src/components/new-game-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGame } from "@/lib/actions/game-actions";

interface NewGameFormProps {
    userId: string;
}

export default function NewGameForm({ userId }: NewGameFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleCreateGame() {
        setIsLoading(true);
        try {
            const game = await createGame(userId);
            router.push(`/game/${game.id}`);
        } catch (error) {
            console.error("Failed to create game:", error);
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a new Tic-Tac-Toe game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Start a new game and share the link with a friend to play together.
                    You'll play as X and your opponent will play as O.
                </p>
                <Button
                    onClick={handleCreateGame}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "Creating..." : "Create Game"}
                </Button>
            </CardContent>
        </Card>
    );
}