import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCourseSlugs } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "",
    "/about",
    "/courses",
    "/faculty",
    "/churches",
    "/results",
    "/gallery",
    "/contact",
    "/apply",
  ];

  let slugs: string[] = [];
  try {
    slugs = await getCourseSlugs();
  } catch {
    // DB unreachable — serve the static paths only; next revalidation will
    // pick up the course pages once the connection works.
  }

  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...slugs.map((slug) => ({
      url: `${site.url}/courses/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
