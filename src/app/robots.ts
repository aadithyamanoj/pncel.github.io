import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
