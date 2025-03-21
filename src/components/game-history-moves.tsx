// src/components/game-history-moves.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GameHistoryMovesProps {
    moves: {
        id: string;
        player: string;
        position: number;
        createdAt: Date;
    }[];
    playerX: {
        id: string;
        name?: string | null;
        image?: string | null;
    };
    playerO?: {
        id: string;
        name?: string | null;
        image?: string | null;
    } | null;
}

export default function GameHistoryMoves({ moves, playerX, playerO }: GameHistoryMovesProps) {
    const [showAll, setShowAll] = useState(false);

    // Determine which moves to display based on showAll state
    const displayedMoves = showAll ? moves : moves.slice(0, 5);
    const hasMoreMoves = moves.length > 5;

    function getPlayerInfo(player: string) {
        if (player === "X") {
            return {
                name: playerX?.name || "Player X",
                image: playerX?.image,
            };
        } else {
            return {
                name: playerO?.name || "Player O",
                image: playerO?.image,
            };
        }
    }

    function getInitials(name: string) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }

    function getPositionLabel(position: number) {
        const row = Math.floor(position / 3) + 1;
        const col = (position % 3) + 1;
        return `Row ${row}, Column ${col}`;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Moves</CardTitle>
            </CardHeader>
            <CardContent>
                {moves.length === 0 ? (
                    <p className="text-muted-foreground text-center">No moves have been made yet.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {displayedMoves.map((move, index) => {
                                const playerInfo = getPlayerInfo(move.player);
                                const formattedTime = new Date(move.createdAt).toLocaleTimeString();

                                return (
                                    <div key={move.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                                        <div className="w-8 text-center font-mono text-muted-foreground">
                                            {index + 1}.
                                        </div>

                                        <Avatar className="h-8 w-8 mr-2">
                                            {playerInfo.image ? (
                                                <AvatarImage src={playerInfo.image} alt={playerInfo.name} />
                                            ) : (
                                                <AvatarFallback>{getInitials(playerInfo.name)}</AvatarFallback>
                                            )}
                                        </Avatar>

                                        <div className="flex-grow">
                                            <div className="flex items-center">
                                                <span className="font-medium">{playerInfo.name}</span>
                                                <Badge variant="outline" className="ml-2">
                                                    {move.player}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Placed at {getPositionLabel(move.position)}
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            {formattedTime}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {hasMoreMoves && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? "Show Less" : `Show All (${moves.length}) Moves`}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
