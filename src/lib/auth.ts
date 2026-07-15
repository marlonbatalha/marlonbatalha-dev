import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Usuário", type: "text", placeholder: "admin" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                // Em produção, use as variáveis de ambiente reais
                const adminUser = process.env.ADMIN_USER || "admin";
                const adminPass = process.env.ADMIN_PASS || "admin";

                if (credentials?.username === adminUser && credentials?.password === adminPass) {
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
    secret: process.env.NEXTAUTH_SECRET || "uma_chave_secreta_padrao_para_desenvolvimento_123",
};
