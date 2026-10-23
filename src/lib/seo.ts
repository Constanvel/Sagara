import type { Metadata } from "next";
import { contact } from "@/data/contact";

export const siteUrl = "https://sagara-vert.vercel.app";
export const siteName = "SAGARA — Rumah Sunat Modern Banteran";
export const sitePaths = ["/", "/layanan", "/paket", "/galeri", "/kontak", "/pendaftaran"] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).href;
}

// Existing original brand asset, not generated social artwork or patient imagery.
export const siteLogo = {
  url: absoluteUrl("/images/media/sagara-rumah-sunat-modern-banteran-logo.webp"),
  width: 340,
  height: 152,
  alt: "SAGARA Rumah Sunat Modern Banteran",
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = path === "/" ? title : `${title} | SAGARA`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: socialTitle,
      description,
      url: absoluteUrl(path),
      siteName,
      locale: "id_ID",
      type: "website",
      images: [siteLogo],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: [{ url: siteLogo.url, alt: siteLogo.alt }],
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

// No unverified street address, opening hours, credentials, prices, or ratings.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "SAGARA Rumah Sunat Modern Banteran",
  url: absoluteUrl("/"),
  logo: {
    "@type": "ImageObject",
    url: siteLogo.url,
    width: siteLogo.width,
    height: siteLogo.height,
  },
  telephone: `+62${contact.whatsappLabel.replace(/\D/g, "").replace(/^0/, "")}`,
  location: {
    "@type": "Place",
    name: "SAGARA Rumah Sunat Modern Banteran",
    hasMap: contact.mapsUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.coordinates.latitude,
      longitude: contact.coordinates.longitude,
    },
  },
};
