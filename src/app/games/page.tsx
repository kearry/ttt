// src/app/games/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GamesList from "@/components/games-list";

export default async function GamesPage() {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    const games = await prisma.game.findMany({
        where: {
            OR: [
                { playerXId: session.user.id },
                { playerOId: session.user.id },
            ],
        },
        include: {
            playerX: true,
            playerO: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container max-w-4xl mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Games</h1>
                <Button asChild>
                    <Link href="/game/new">Start New Game</Link>
                </Button>
            </div>

            {games.length > 0 ? (
                <GamesList games={games} userId={session.user.id} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No games yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">You haven't played any games yet.</p>
                        <Button asChild>
                            <Link href="/game/new">Start your first game</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}