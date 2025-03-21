// src/app/layout.tsx 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, User, List, LogIn } from "lucide-react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tic-Tac-Toe 3D",
  description: "A modern Tic-Tac-Toe game built with Next.js and Three.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <header className="border-b">
                <div className="container mx-auto flex items-center justify-between h-16 px-4">
                  <Link href="/" className="text-xl font-bold">Tic-Tac-Toe 3D</Link>

                  <nav className="hidden md:flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/">
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Link>
                    </Button>

                    {session ? (
                      <>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/games">
                            <List className="h-4 w-4 mr-2" />
                            My Games
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                    )}

                    <ThemeToggle />
                  </nav>

                  <div className="flex md:hidden items-center space-x-2">
                    <ThemeToggle />

                    {session ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/games">
                          <User className="h-5 w-5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/login">
                          <LogIn className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </header>

              <main className="flex-1">{children}</main>

              <footer className="border-t py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  <p>© {new Date().getFullYear()} Tic-Tac-Toe 3D. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}