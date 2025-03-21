// src/components/features.tsx
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function Features() {
    const features = [
        {
            title: "3D Game Board",
            description: "Experience the classic game in beautiful 3D rendered with Three.js and React Three Fiber.",
            icon: "🎮"
        },
        {
            title: "Play with Friends",
            description: "Challenge your friends to a game by sharing a unique game link.",
            icon: "👥"
        },
        {
            title: "AI Opponent",
            description: "Play against our AI opponent that adapts to your skill level.",
            icon: "🤖"
        },
        {
            title: "Game History",
            description: "Review your past games and track your progress over time.",
            icon: "📊"
        },
        {
            title: "Responsive Design",
            description: "Play on any device - desktop, tablet, or mobile.",
            icon: "📱"
        },
        {
            title: "Dark Mode",
            description: "Play comfortably day or night with automatic theme detection.",
            icon: "🌙"
        }
    ];

    return (
        <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Game Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-primary/5">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">{feature.icon}</div>
                                <div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription className="mt-2">{feature.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
