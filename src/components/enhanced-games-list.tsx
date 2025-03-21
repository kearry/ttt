// src/components/enhanced-games-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, X, CircleIcon } from "lucide-react";

interface EnhancedGamesListProps {
    games: any[];
    userId: string;
}

export default function EnhancedGamesList({ games, userId }: EnhancedGamesListProps) {
    const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

    // Filter games based on selection
    const filteredGames = games.filter(game => {
        if (filter === "all") return true;
        if (filter === "ongoing") return game.status === "ONGOING";
        if (filter === "completed") return game.status !== "ONGOING";
        return true;
    });

    function getGameStatusIcon(game: any) {
        if (game.status === "ONGOING") {
            return <Clock className="h-5 w-5 text-blue-500" />;
        } else if (game.status === "DRAW") {
            return <AlertCircle className="h-5 w-5 text-orange-500" />;
        } else if (
            (game.status === "PLAYER_X_WON" && game.playerXId === userId) ||
            (game.status === "PLAYER_O_WON" && game.playerOId === userId)
        ) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else {
            return <X className="h-5 w-5 text-red-500" />;
        }
    }

    function getOpponentInfo(game: any) {
        if (game.playerXId === userId) {
            return game.playerO
                ? { name: game.playerO.name || "Player O", image: game.playerO.image }
                : { name: "Waiting for opponent", image: null };
        } else {
            return {
                name: game.playerX?.name || "Player X",
                image: game.playerX?.image
            };
        }
    }

    function getPlayerSymbol(game: any) {
        return game.playerXId === userId ? "X" : "O";
    }

    function getStatusText(game: any) {
        if (game.status === "ONGOING") {
            if (!game.playerOId) {
                return "Waiting for opponent";
            }

            const movesCount = game.board.split("").filter((c: string) => c !== "0").length;
            const isUserTurn =
                (getPlayerSymbol(game) === "X" && movesCount % 2 === 0) ||
                (getPlayerSymbol(game) === "O" && movesCount % 2 === 1);

            return isUserTurn ? "Your turn" : "Opponent's turn";
        } else if (game.status === "DRAW") {
            return "Draw";
        } else if (
            (game.status === "PLAYER_X_WON" && game.playerXId === userId) ||
            (game.status === "PLAYER_O_WON" && game.playerOId === userId)
        ) {
            return "You won";
        } else {
            return "You lost";
        }
    }

    function getInitials(name: string | null) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                >
                    All Games
                </Button>
                <Button
                    variant={filter === "ongoing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("ongoing")}
                >
                    Ongoing
                </Button>
                <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </Button>
            </div>

            {filteredGames.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No games found with the selected filter.</p>
                    </CardContent>
                </Card>
            ) : (
                filteredGames.map((game) => {
                    const opponent = getOpponentInfo(game);
                    const statusText = getStatusText(game);
                    const playerSymbol = getPlayerSymbol(game);

                    return (
                        <Card key={game.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-center p-4 md:p-6">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className="flex-shrink-0">
                                            <Avatar className="h-10 w-10">
                                                {opponent.image ? (
                                                    <AvatarImage src={opponent.image} alt={opponent.name} />
                                                ) : (
                                                    <AvatarFallback>{getInitials(opponent.name)}</AvatarFallback>
                                                )}
                                            </Avatar>
                                        </div>

                                        <div className="min-w-0 flex-grow">
                                            <div className="flex items-center">
                                                <p className="font-medium truncate">
                                                    vs. {opponent.name}
                                                </p>
                                                <Badge variant="outline" className="ml-2">
                                                    {playerSymbol}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1 mr-3">
                                                    {getGameStatusIcon(game)}
                                                    <span>{statusText}</span>
                                                </div>

                                                <span className="text-xs">
                                                    {formatDistanceToNow(new Date(game.createdAt))} ago
                                                </span>
                                            </div>
                                        </div>

                                        <Button asChild size="sm" variant={game.status === "ONGOING" ? "default" : "outline"}>
                                            <Link href={`/game/${game.id}`}>
                                                {game.status === "ONGOING" ? "Play" : "View"}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {game.status !== "ONGOING" && (
                                    <div className="grid grid-cols-9 h-2 w-full">
                                        {game.board.split("").map((cell: string, i: number) => {
                                            let bgColor = "bg-muted";

                                            if (cell === "1") {
                                                bgColor = "bg-primary";
                                            } else if (cell === "2") {
                                                bgColor = "bg-secondary";
                                            }

                                            return <div key={i} className={bgColor}></div>;
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })
            )}
        </div>
    );
}