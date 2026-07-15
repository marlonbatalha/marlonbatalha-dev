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
        <div className="min-h-screen flex items-center justify-center bg-black font-mono">
            <div className="w-full max-w-md border border-gray-800 p-8 rounded bg-gray-950">
                <h1 className="text-2xl font-bold text-green-500 mb-6 text-center">Admin Login</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 rounded p-2 text-green-500 focus:border-green-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 rounded p-2 text-green-500 focus:border-green-500 outline-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-green-600 text-black font-bold p-2 rounded hover:bg-green-500 transition-colors"
                    >
                        Acessar Terminal
                    </button>
                </form>
            </div>
        </div>
    );
}
