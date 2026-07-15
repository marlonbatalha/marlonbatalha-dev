"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-500 hover:text-black transition-colors text-sm"
        >
            Sair [x]
        </button>
    );
}
