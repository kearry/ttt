import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserProfile from "@/components/user-profile";
import GameModes from "@/components/game-modes";
import Features from "@/components/features";
import Hero3D from "@/components/3d/hero-3d";

export default async function Home() {
  const session = await auth();

  // Debug log to check session data
  console.log("Session data:", JSON.stringify(session, null, 2));

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tic-Tac-Toe in 3D</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Experience the classic game with modern technology. Play against friends or AI in a beautiful 3D environment.
          </p>

          {session?.user?.id ? (
            <div className="w-full mb-8">
              <UserProfile user={session.user} />

              <div className="mt-8">
                <GameModes userId={session.user.id} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-8">
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

        <div className="mb-12 h-[400px] w-full">
          <Card className="w-full h-full overflow-hidden">
            <Hero3D />
          </Card>
        </div>

        <Features />
      </div>
    </main>
  );
}