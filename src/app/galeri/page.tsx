import { absoluteUrl, pageMetadata, serializeJsonLd, siteUrl } from "@/lib/seo";
import { galleryMedia } from "@/data/media";
import { GallerySection } from "@/components/sections/GallerySection";

export const metadata = pageMetadata(
  "Galeri",
  "Momen keluarga, suasana, dan cerita para jagoan di Sagara Rumah Sunat Modern.",
  "/galeri",
);

export default function GaleriPage() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/galeri")}#collection`,
    name: "Galeri Sagara",
    url: absoluteUrl("/galeri"),
    inLanguage: "id",
    publisher: { "@id": `${siteUrl}/#organization` },
    hasPart: galleryMedia.filter((item) => item.type === "photo").map((item) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(item.src),
      name: item.title,
      description: item.alt,
      width: item.width,
      height: item.height,
    })),
  };

  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collection) }} />
      <GallerySection />
    </main>
  );
}
