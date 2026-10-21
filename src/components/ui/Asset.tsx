import Image from "next/image";

// Descriptive aliases retain compatibility with existing exported Figma asset names.
const assetNames: Record<string, string> = {
  "imgGroup.svg": "highlight-without-stitches.svg",
  "imgIcon.svg": "highlight-bathe-immediately.svg",
  "imgVector.svg": "highlight-needle-free.svg",
  "imgIcon1.svg": "highlight-neat-result.svg",
  "imgContainer.svg": "method-klamp-shield.svg",
  "imgContainer1.svg": "method-bullet-check.svg",
  "imgContainer2.svg": "method-needle-free-air.svg",
  "imgSmile.svg": "service-child-smile.svg",
  "imgBaby.svg": "service-infant.svg",
  "imgUserRound.svg": "service-adult.svg",
  "imgHeartHandshake.svg": "service-special-support.svg",
  "imgAccessibility.svg": "service-body-assessment.svg",
  "imgAward.svg": "benefit-certificate.svg",
  "imgGift.svg": "benefit-gift.svg",
  "imgPill.svg": "benefit-medication.svg",
  "imgMessagesSquare.svg": "benefit-follow-up-chat.svg",
  "imgStethoscope.svg": "benefit-checkup.svg",
  "imgShirt.svg": "benefit-clothing.svg",
  "imgArrowUpRight.svg": "service-consultation-arrow.svg",
  "imgArrowRight.svg": "consultation-arrow-right.svg",
  "imgMessageCircle.svg": "homecare-chat.svg",
  "imgMessageCircle1.svg": "faq-chat.svg",
  "imgMessageCircle2.svg": "consultation-chat.svg",
  "imgHouseHeart.svg": "homecare-house.svg",
  "imgImage16.png": "sagara-homecare-vehicle.webp",
  "sagara-homecare-vehicle.png": "sagara-homecare-vehicle.webp",
  "imgArtworkAsli.png": "sagara-footer-logo-artwork.png",
};

type Props = { name: string; width: number; height: number; className?: string; alt?: string; loading?: "eager" | "lazy"; sizes?: string };
export function Asset({ name, width, height, className, alt = "", loading, sizes }: Props) {
  return <Image src={`/images/figma/${assetNames[name] ?? name}`} width={Math.round(width)} height={Math.round(height)} alt={alt} className={className} loading={loading} sizes={sizes} style={{ height: "auto" }} />;
}
