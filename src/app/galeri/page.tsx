import type { Metadata } from "next";
import { GallerySection } from "@/components/sections/GallerySection";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Momen keluarga, suasana, dan cerita para jagoan di Sagara Rumah Sunat Modern.",
};

export default function GaleriPage() {
  return <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft"><GallerySection /></main>;
}
