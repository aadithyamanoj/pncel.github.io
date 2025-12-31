import { MetadataRoute } from "next";
import { Database } from "@/lib/database";
import { siteConfig } from "@/lib/utils";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await Database.get();

  // Get all dynamic routes
  const members = await db.getManyMembers();
  const allPublications = await db.getManyPublications();

  // Get unique blog IDs by checking the blogs directory
  const fs = require("fs");
  const path = require("path");
  const blogsDir = path.join(process.cwd(), "src/app/blogs/[blogId]");
  const blogFiles = fs.existsSync(blogsDir)
    ? fs.readdirSync(blogsDir).filter((file: string) => file.endsWith(".mdx"))
    : [];
  const blogIds = blogFiles.map((file: string) => file.replace(".mdx", ""));

  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pubs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic member routes
  const memberRoutes: MetadataRoute.Sitemap = members.map((member) => ({
    url: `${baseUrl}/team/${member.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic publication routes (by member)
  const pubRoutes: MetadataRoute.Sitemap = members
    .filter((member) => {
      // Only include members who have publications
      const pubs = allPublications.filter((pub) =>
        pub.authorIds.includes(member.id),
      );
      return pubs.length > 0;
    })
    .map((member) => ({
      url: `${baseUrl}/pubs/${member.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  // Dynamic blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogIds.map((blogId: string) => ({
    url: `${baseUrl}/blogs/${blogId}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...memberRoutes, ...pubRoutes, ...blogRoutes];
}
