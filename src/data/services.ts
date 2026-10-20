export type KhitanService = Readonly<{
  id: string;
  title: string;
  description: string;
  icon: "service-security.svg" | "service-baby.svg" | "service-contact.svg" | "service-like.svg";
  iconWidth: number;
  iconHeight: number;
  message: string;
}>;

export const services: readonly KhitanService[] = [
  {
    id: "anak-anak",
    title: "Khitan anak-anak",
    description: "Dampingi jagoan memahami proses dan persiapannya.",
    icon: "service-security.svg",
    iconWidth: 39,
    iconHeight: 30,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang khitan anak-anak dan persiapannya.",
  },
  {
    id: "bayi",
    title: "Khitan bayi",
    description: "Bahas usia, kesiapan, dan kebutuhan perawatan bayi.",
    icon: "service-baby.svg",
    iconWidth: 32,
    iconHeight: 32,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang usia, kesiapan, dan perawatan khitan bayi.",
  },
  {
    id: "dewasa",
    title: "Khitan dewasa",
    description: "Konsultasikan kebutuhan dan rencana perawatan Anda.",
    icon: "service-contact.svg",
    iconWidth: 26,
    iconHeight: 26,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang khitan dewasa dan rencana perawatannya.",
  },
  {
    id: "kebutuhan-khusus",
    title: "Kebutuhan khusus",
    description: "Sampaikan kebutuhan pendampingan sejak awal.",
    icon: "service-like.svg",
    iconWidth: 24,
    iconHeight: 24,
    message: "Halo admin Sagara, saya ingin membahas kebutuhan khusus dan pendampingan untuk khitan.",
  },
  // The repeated entry is intentional in the approved Layanan design.
  {
    id: "kebutuhan-khusus-pendampingan",
    title: "Kebutuhan khusus",
    description: "Sampaikan kebutuhan pendampingan sejak awal.",
    icon: "service-like.svg",
    iconWidth: 24,
    iconHeight: 24,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang pendampingan khitan bagi keluarga dengan kebutuhan khusus.",
  },
];
