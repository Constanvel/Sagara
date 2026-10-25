import { galleryMedia } from "./gallery";
import { carouselSlides } from "./hero-slides";

// Twenty distinct photographs; publication consent is a separate operational requirement.
export const heroSlides = carouselSlides.map(({ src, heading, description }) => {
  const media = galleryMedia.find(media => media.src === src)!;
  return { ...media, heading, description };
});
