// src/components/join-game-card.tsx
"use client";

import { useGame } from "@/contexts/game-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function JoinGameCard({ inviter }: { inviter: string }) {
    const { isLoading, handleJoinGame, error } = useGame();

    return (
        <Card className="p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Join this game?</h2>
            <p className="text-center mb-6">
                You&apos;ve been invited to play against {inviter || "Player X"}
            </p>
            <Button
                onClick={handleJoinGame}
                disabled={isLoading}
                className="w-full max-w-xs"
            >
                {isLoading ? "Joining..." : "Join Game as Player O"}
            </Button>

            {error && (
                <div className="mt-4 p-2 bg-destructive/10 border border-destructive text-destructive rounded flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>{error}</span>
                </div>
            )}
        </Card>
    );
}