// src/app/register/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/register-form";

export default async function RegisterPage() {
    const session = await auth();

    // Redirect to home if already logged in
    if (session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
                <RegisterForm />
            </div>
        </div>
    );
}