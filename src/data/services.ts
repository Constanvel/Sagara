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
    description: "Diskusikan kesiapan anak, pilihan metode, pembiusan, dan pendampingan. Tanyakan persiapan kunjungan serta rencana perawatannya.",
    icon: "service-security.svg",
    // The exported 39×30 frame had empty right/top space; use the centered SVG viewport.
    iconWidth: 24,
    iconHeight: 30,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang khitan anak-anak dan persiapannya.",
  },
  {
    id: "bayi",
    title: "Khitan bayi",
    description: "Konsultasikan usia, kondisi, dan kesiapan bayi sebelum menentukan tindakan. Bahas kesesuaian metode serta kebutuhan perawatan bersama tenaga medis.",
    icon: "service-baby.svg",
    iconWidth: 32,
    iconHeight: 32,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang usia, kesiapan, dan perawatan khitan bayi.",
  },
  {
    id: "dewasa",
    title: "Khitan dewasa",
    description: "Bahas kondisi kesehatan, pilihan metode, manfaat, dan risiko. Konfirmasikan persiapan, jadwal kunjungan, serta batas aktivitas selama perawatan.",
    icon: "service-contact.svg",
    iconWidth: 26,
    iconHeight: 26,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang khitan dewasa dan rencana perawatannya.",
  },
  {
    id: "kebutuhan-khusus",
    title: "Kebutuhan khusus",
    description: "Sampaikan kebutuhan pendampingan sejak awal. Kelayakan tindakan, kesiapan tempat, dan rencana perawatan perlu dikonfirmasi saat konsultasi.",
    icon: "service-like.svg",
    iconWidth: 24,
    iconHeight: 24,
    message: "Halo admin Sagara, saya ingin membahas kebutuhan khusus dan pendampingan untuk khitan.",
  },
  // Figma Layanan 25:892 repeats this title at 25:950 and 25:959.
  // Preserve both until their distinct business intent is confirmed; do not invent a service.
  {
    id: "kebutuhan-khusus-pendampingan",
    title: "Kebutuhan khusus",
    description: "Sampaikan kebutuhan pendampingan sejak awal. Kelayakan tindakan, kesiapan tempat, dan rencana perawatan perlu dikonfirmasi saat konsultasi.",
    icon: "service-like.svg",
    iconWidth: 24,
    iconHeight: 24,
    message: "Halo admin Sagara, saya ingin berkonsultasi tentang pendampingan khitan bagi keluarga dengan kebutuhan khusus.",
  },
];
