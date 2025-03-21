// src/app/game/new/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewGameForm from "@/components/new-game-form";

export default async function NewGamePage() {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Start a New Game</h1>
            <NewGameForm userId={session.user.id} />
        </div>
    );
}