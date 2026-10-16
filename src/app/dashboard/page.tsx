import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-term-bg text-term-green font-mono p-8">
            <header className="flex justify-between items-center border-b border-term-line pb-4 mb-8">
                <h1 className="text-2xl font-bold">Terminal Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Logado como: {session.user?.name}</span>
                    <LogoutButton />
                </div>
            </header>

            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-term-line p-6 rounded bg-term-panel">
                        <h2 className="text-xl mb-4 text-term-text">⚙️ Gerenciar Projetos</h2>
                        <p className="text-term-subtle">Em breve você poderá adicionar, editar e remover projetos por aqui.</p>
                    </div>

                    <div className="border border-term-line p-6 rounded bg-term-panel">
                        <h2 className="text-xl mb-4 text-term-text">📬 Mensagens Recebidas</h2>
                        <p className="text-term-subtle">Em breve você verá os contatos recebidos pelo formulário aqui.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
