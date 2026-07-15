import middleware from "next-auth/middleware";

export default middleware;

export const config = {
    // Protege todas as rotas dentro de /dashboard
    matcher: ["/dashboard/:path*"],
};
