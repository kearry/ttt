// src/components/games-list.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "@/lib/utils";

interface GamesListProps {
    games: any[];
    userId: string;
}

export default function GamesList({ games, userId }: GamesListProps) {
    function getGameStatusText(game: any) {
        if (game.status === "ONGOING") {
            return "Game in progress";
        } else if (game.status === "DRAW") {
            return "Game ended in a draw";
        } else if (
            (game.status === "PLAYER_X_WON" && game.playerXId === userId) ||
            (game.status === "PLAYER_O_WON" && game.playerOId === userId)
        ) {
            return "You won!";
        } else {
            return "You lost";
        }
    }

    function getOpponentName(game: any) {
        if (game.playerXId === userId) {
            return game.playerO?.name || "Waiting for opponent";
        } else {
            return game.playerX?.name || "Unknown opponent";
        }
    }

    function getPlayerSymbol(game: any) {
        return game.playerXId === userId ? "X" : "O";
    }

    return (
        <div className="space-y-4">
            {games.map((game) => (
                <Card key={game.id}>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center">
                            <span>Game vs {getOpponentName(game)}</span>
                            <span className="text-sm bg-secondary px-2 py-1 rounded">
                                {getPlayerSymbol(game)}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium">{getGameStatusText(game)}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(game.createdAt))} ago
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={`/game/${game.id}`}>
                                    {game.status === "ONGOING" ? "Continue" : "View"}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}