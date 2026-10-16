"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Credenciais inválidas. Acesso negado.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-term-bg font-mono">
            <div className="w-full max-w-md border border-term-line p-8 rounded bg-term-window">
                <h1 className="text-2xl font-bold text-term-green mb-6 text-center">Admin Login</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="text-sm text-term-subtle mb-1 block">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-term-bg border border-term-line-strong rounded p-2 text-term-green focus:border-term-green outline-hidden"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="text-sm text-term-subtle mb-1 block">Senha</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-term-bg border border-term-line-strong rounded p-2 text-term-green focus:border-term-green outline-hidden"
                        />
                    </div>

                    {error && <p className="text-term-red text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-term-green text-black font-bold p-2 rounded hover:bg-term-green/85 transition-colors"
                    >
                        Acessar Terminal
                    </button>
                </form>
            </div>
        </div>
    );
}
