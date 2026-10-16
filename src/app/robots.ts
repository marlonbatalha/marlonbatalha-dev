import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Área logada e API não devem ser indexadas
            disallow: ["/dashboard", "/login", "/api/"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
