import type { Metadata } from "next";

export const SITE = {
  name: "STREETCREED",
  tagline: "Modern luxury, quietly made",
  description:
    "STREETCREED is a premium fashion house for considered clothing — tailoring, silk, cashmere and essentials built to be worn for a decade, not a season.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://streetcreed.co",
};

export function pageMetadata(title: string, description?: string, path = ""): Metadata {
  const fullTitle = `${title} — ${SITE.name}`;
  const desc = description || SITE.description;
  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc },
  };
}
