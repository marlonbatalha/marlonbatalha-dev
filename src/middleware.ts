export { default } from "next-auth/middleware";

export const config = {
    // Protege todas as rotas dentro de /dashboard
    matcher: ["/dashboard/:path*"],
};
