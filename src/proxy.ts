import { withAuth } from "next-auth/middleware";

// O proxy roda antes da rota e não lê o `authOptions` — por isso a página de
// login customizada precisa ser informada aqui também. Sem isso, quem acessa
// /dashboard sem sessão passa antes por /api/auth/signin (página padrão do
// NextAuth) para só então chegar em /login.
export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    // Protege todas as rotas dentro de /dashboard
    matcher: ["/dashboard/:path*"],
};
