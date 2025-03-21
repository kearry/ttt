// src/app/game/[id]/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GameProvider } from "@/contexts/game-context";
import GameBoard3D from "@/components/3d/game-board-3d";
import GameStatus from "@/components/game-status";
import GameInfo from "@/components/game-info";
import JoinGameCard from "@/components/join-game-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function GamePage({ params }: { params: { id: string } }) {
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
    const canJoin = !isPlayerX && !isPlayerO && !game.playerOId;

    // If the user is not a player and the game already has an opponent, redirect
    if (!isPlayerX && !isPlayerO && game.playerOId) {
        return (
            <div className="container max-w-4xl mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Game Not Available</h1>
                <p>You are not a player in this game.</p>
                <Button asChild className="mt-4">
                    <Link href="/games">View Your Games</Link>
                </Button>
            </div>
        );
    }

    // Determine user's role
    const userRole = isPlayerX ? "X" : "O";

    return (
        <div className="container max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Tic-Tac-Toe Game</h1>

            <GameProvider gameData={game} userRole={userRole} userId={session.user.id}>
                <GameStatus />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {canJoin ? (
                            <JoinGameCard inviter={game.playerX.name || "Player X"} />
                        ) : (
                            <GameBoard3D />
                        )}
                    </div>
                    <div>
                        <GameInfo game={game} userRole={userRole} />
                    </div>
                </div>
            </GameProvider>
        </div>
    );
}