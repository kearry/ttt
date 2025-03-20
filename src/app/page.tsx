// src/app/page.tsx
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfile from "@/components/user-profile";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Tic-Tac-Toe Game</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Play the classic game with friends or against the AI
          </p>

          {session ? (
            <div className="w-full">
              <UserProfile user={session.user} />
              <div className="flex gap-4 justify-center mt-8">
                <Button asChild size="lg">
                  <Link href="/game/new">Start New Game</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/games">View Game History</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-4">Sign in to start playing</p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Play Anywhere</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Play on any device with a modern web browser. Your game progress is saved automatically.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Play with Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Challenge your friends to a game or play against our AI in different difficulty levels.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Keep track of your games, wins, and improve your strategy over time.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}