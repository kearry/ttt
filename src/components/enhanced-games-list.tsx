// src/components/enhanced-games-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, X, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteGame } from "@/lib/actions/game-actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedGamesListProps {
    games: {
        id: string;
        status: "ONGOING" | "DRAW" | "PLAYER_X_WON" | "PLAYER_O_WON";
        playerXId: string;
        playerOId: string | null;
        playerX?: { name: string; image?: string };
        playerO?: { name: string; image?: string };
        board: string;
        createdAt: string;
    }[];
    userId: string;
}

export default function EnhancedGamesList({ games, userId }: EnhancedGamesListProps) {
    const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    // Filter games based on selection
    const filteredGames = games.filter(game => {
        if (filter === "all") return true;
        if (filter === "ongoing") return game.status === "ONGOING";
        if (filter === "completed") return game.status !== "ONGOING";
        return true;
    });

    async function handleDeleteGame(gameId: string) {
        setIsDeleting(gameId);
        try {
            await deleteGame(gameId, userId);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete game:", error);
        } finally {
            setIsDeleting(null);
        }
    }

    function getGameStatusIcon(game: EnhancedGamesListProps["games"][number]) {
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

    function getOpponentInfo(game: EnhancedGamesListProps["games"][number]) {
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

    function getPlayerSymbol(game: EnhancedGamesListProps["games"][number]) {
        return game.playerXId === userId ? "X" : "O";
    }

    function getStatusText(game: EnhancedGamesListProps["games"][number]) {
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

                                        <div className="flex items-center space-x-2">
                                            <Button asChild size="sm" variant={game.status === "ONGOING" ? "default" : "outline"}>
                                                <Link href={`/game/${game.id}`}>
                                                    {game.status === "ONGOING" ? "Play" : "View"}
                                                </Link>
                                            </Button>

                                            <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Game
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Game</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this game? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteGame(game.id)}
                                                            disabled={isDeleting === game.id}
                                                        >
                                                            {isDeleting === game.id ? "Deleting..." : "Delete"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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