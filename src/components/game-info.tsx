// src/components/game-info.tsx (updated with history link)
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";

interface GameInfoProps {
    game: any;
    userRole: string;
}

export default function GameInfo({ game, userRole }: GameInfoProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const otherPlayerJoined = !!game.playerOId;
    const isGameOver = game.status !== "ONGOING";

    const statusMessages: Record<string, string> = {
        ONGOING: "Game in progress",
        PLAYER_X_WON: "Player X won",
        PLAYER_O_WON: "Player O won",
        DRAW: "Game ended in a draw"
    };

    const currentTurn = game.board.split("").filter((c: string) => c !== "0").length % 2 === 0
        ? "X"
        : "O";

    function getInitials(name: string | null) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium mb-2">Status</p>
                    <p className="bg-secondary p-2 rounded">{statusMessages[game.status]}</p>
                </div>

                {!isGameOver && (
                    <div>
                        <p className="text-sm font-medium mb-2">Current Turn</p>
                        <p className="bg-secondary p-2 rounded font-bold">Player {currentTurn}</p>
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium mb-2">Players</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                {game.playerX.image ? (
                                    <AvatarImage src={game.playerX.image} alt={game.playerX.name || "Player X"} />
                                ) : (
                                    <AvatarFallback>{getInitials(game.playerX.name)}</AvatarFallback>
                                )}
                            </Avatar>
                            <span>{game.playerX.name || "Player X"}</span>
                            <Badge variant="outline" className="ml-auto">X</Badge>
                        </div>

                        {otherPlayerJoined ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    {game.playerO.image ? (
                                        <AvatarImage src={game.playerO.image} alt={game.playerO.name || "Player O"} />
                                    ) : (
                                        <AvatarFallback>{getInitials(game.playerO.name)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <span>{game.playerO.name || "Player O"}</span>
                                <Badge variant="outline" className="ml-auto">O</Badge>
                            </div>
                        ) : (
                            <div className="p-2 border border-dashed rounded text-center">
                                <p className="text-sm text-muted-foreground mb-2">Waiting for opponent to join</p>
                                <Button size="sm" onClick={handleCopyLink}>
                                    {copied ? "Copied!" : "Copy Invite Link"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">You are playing as</p>
                    <p className="bg-primary text-primary-foreground p-2 rounded font-bold text-center">
                        Player {userRole}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/games")}
                    >
                        Back to Games
                    </Button>

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link href={`/game/${game.id}/history`}>
                            <History className="h-4 w-4 mr-2" />
                            Game History
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Now let's create an enhanced games list component
