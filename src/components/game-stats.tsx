// src/components/game-stats.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Award, X, CircleIcon } from "lucide-react";

interface GameStatsProps {
    games: any[];
    userId: string;
}

export default function GameStats({ games, userId }: GameStatsProps) {
    // Calculate statistics
    const totalGames = games.length;
    const completedGames = games.filter(game => game.status !== "ONGOING").length;
    const ongoingGames = totalGames - completedGames;

    const wins = games.filter(game =>
        (game.status === "PLAYER_X_WON" && game.playerXId === userId) ||
        (game.status === "PLAYER_O_WON" && game.playerOId === userId)
    ).length;

    const losses = games.filter(game =>
        (game.status === "PLAYER_X_WON" && game.playerOId === userId) ||
        (game.status === "PLAYER_O_WON" && game.playerXId === userId)
    ).length;

    const draws = games.filter(game => game.status === "DRAW").length;

    // Calculate win percentage
    const winPercentage = completedGames > 0
        ? Math.round((wins / completedGames) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Total Games</CardDescription>
                    <CardTitle className="text-3xl">{totalGames}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {ongoingGames} ongoing
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Wins</CardDescription>
                    <CardTitle className="text-3xl text-green-600">{wins}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" /> {winPercentage}% win rate
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Losses</CardDescription>
                    <CardTitle className="text-3xl text-red-600">{losses}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center gap-1">
                    <X className="h-4 w-4 text-red-600" /> {Math.round((losses / completedGames) * 100) || 0}% loss rate
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Draws</CardDescription>
                    <CardTitle className="text-3xl text-orange-600">{draws}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center gap-1">
                    <Award className="h-4 w-4 text-orange-600" /> {Math.round((draws / completedGames) * 100) || 0}% draw rate
                </CardContent>
            </Card>
        </div>
    );
}