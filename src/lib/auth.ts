import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash, timingSafeEqual } from "crypto";

// Compara em tempo constante para não vazar, pelo tempo de resposta, quantos
// caracteres do usuário/senha estavam corretos. O hash iguala o tamanho dos
// buffers, exigência do timingSafeEqual.
function safeEqual(a: string, b: string) {
    const hashA = createHash("sha256").update(a).digest();
    const hashB = createHash("sha256").update(b).digest();
    return timingSafeEqual(hashA, hashB);
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Usuário", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const adminUser = process.env.ADMIN_USER;
                const adminPass = process.env.ADMIN_PASS;

                // Sem credenciais configuradas o login fica desativado — nunca
                // cair para um usuário/senha padrão conhecido.
                if (!adminUser || !adminPass) {
                    console.error("[auth] ADMIN_USER/ADMIN_PASS não configurados — login desativado.");
                    return null;
                }

                if (!credentials?.username || !credentials?.password) return null;

                const userOk = safeEqual(credentials.username, adminUser);
                const passOk = safeEqual(credentials.password, adminPass);

                if (userOk && passOk) {
                    return { id: "1", name: "Marlon Batalha", email: "marlonbatalha06@gmail.com" };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/login", // Redireciona para a página customizada de login
    },
    session: {
        strategy: "jwt",
    },
    // Sem fallback: em produção o NextAuth recusa iniciar sem NEXTAUTH_SECRET,
    // em vez de assinar os JWTs com uma chave pública que está no repositório.
    secret: process.env.NEXTAUTH_SECRET,
};
