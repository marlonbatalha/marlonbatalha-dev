"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border border-term-green text-term-green px-3 py-1 rounded hover:bg-term-green/85 hover:text-black transition-colors text-sm"
        >
            Sair [x]
        </button>
    );
}
