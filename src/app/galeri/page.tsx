import { pageMetadata } from "@/lib/seo";
import { galleryMedia } from "@/data/media";
import { GallerySection } from "@/components/sections/GallerySection";

export const metadata = pageMetadata(
  "Galeri",
  "Momen keluarga, suasana, dan cerita para jagoan di Sagara Rumah Sunat Modern.",
  "/galeri",
);

export default function GaleriPage() {
  return <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Galeri Sagara", url: "https://sagara-vert.vercel.app/galeri", hasPart: galleryMedia.filter(item => item.type === "photo").map(item => ({ "@type": "ImageObject", contentUrl: `https://sagara-vert.vercel.app${item.src}`, name: item.title, description: item.alt, width: item.width, height: item.height })) }).replace(/</g, "\\u003c") }} /><GallerySection /></main>;
}
