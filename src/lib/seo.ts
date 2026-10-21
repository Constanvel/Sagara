import type { Metadata } from "next";

export const siteUrl = "https://sagara-vert.vercel.app";
export const siteName = "SAGARA — Rumah Sunat Modern Banteran";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: path === "/" ? siteName : `${title} | SAGARA`,
      description,
      url: path,
      siteName,
      locale: "id_ID",
      type: "website",
    },
    twitter: { card: "summary", title: path === "/" ? siteName : `${title} | SAGARA`, description },
  };
}
