// src/app/game/[id]/history/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import GameHistoryMoves from "@/components/game-history-moves";

export default async function GameHistoryPage({ params }: { params: { id: string } }) {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    const game = await prisma.game.findUnique({
        where: { id: params.id },
        include: {
            playerX: true,
            playerO: true,
            moves: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    // Return 404 if game not found
    if (!game) {
        notFound();
    }

    // Check if user is a player in the game
    const isPlayerX = game.playerXId === session.user.id;
    const isPlayerO = game.playerOId === session.user.id;

    // If the user is not a player, redirect
    if (!isPlayerX && !isPlayerO) {
        redirect("/games");
    }

    function getStatusText(status: string) {
        switch (status) {
            case "ONGOING":
                return { text: "Game in progress", variant: "info" as const };
            case "DRAW":
                return { text: "Game ended in a draw", variant: "warning" as const };
            case "PLAYER_X_WON":
                return {
                    text: `${game.playerX.name || "Player X"} won`,
                    variant: isPlayerX ? "success" as const : "destructive" as const
                };
            case "PLAYER_O_WON":
                return {
                    text: `${game.playerO?.name || "Player O"} won`,
                    variant: isPlayerO ? "success" as const : "destructive" as const
                };
            default:
                return { text: "Unknown status", variant: "default" as const };
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

    const statusInfo = getStatusText(game.status);
    const gameDate = new Date(game.createdAt).toLocaleDateString();
    const gameTime = new Date(game.createdAt).toLocaleTimeString();

    return (
        <div className="container max-w-4xl mx-auto py-10">
            <div className="flex items-center mb-6">
                <Button variant="outline" size="icon" className="mr-4" asChild>
                    <Link href={`/game/${params.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Game History</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Game Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="flex-1 font-medium">Status</div>
                                <Badge variant={statusInfo.variant}>
                                    {statusInfo.text}
                                </Badge>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-1 font-medium">Created</div>
                                <span className="text-sm text-muted-foreground">
                                    {gameDate} at {gameTime}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-1 font-medium">Total Moves</div>
                                <span className="text-sm">{game.moves.length}</span>
                            </div>

                            <div className="border-t pt-2">
                                <div className="font-medium mb-2">Players</div>

                                <div className="flex items-center mb-2">
                                    <Avatar className="h-6 w-6 mr-2">
                                        {game.playerX.image ? (
                                            <AvatarImage src={game.playerX.image} alt={game.playerX.name || "Player X"} />
                                        ) : (
                                            <AvatarFallback>{getInitials(game.playerX.name)}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="flex-1">{game.playerX.name || "Player X"}</span>
                                    <Badge variant="outline">X</Badge>
                                </div>

                                {game.playerO && (
                                    <div className="flex items-center">
                                        <Avatar className="h-6 w-6 mr-2">
                                            {game.playerO.image ? (
                                                <AvatarImage src={game.playerO.image} alt={game.playerO.name || "Player O"} />
                                            ) : (
                                                <AvatarFallback>{getInitials(game.playerO.name)}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="flex-1">{game.playerO.name || "Player O"}</span>
                                        <Badge variant="outline">O</Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Final Board</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-1 aspect-square">
                                {game.board.split("").map((cell, index) => {
                                    let content = "";
                                    let bgClass = "bg-muted";

                                    if (cell === "1") {
                                        content = "X";
                                        bgClass = "bg-primary/10";
                                    } else if (cell === "2") {
                                        content = "O";
                                        bgClass = "bg-secondary/10";
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-center ${bgClass} aspect-square text-xl font-bold`}
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <GameHistoryMoves moves={game.moves} playerX={game.playerX} playerO={game.playerO} />
        </div>
    );
}