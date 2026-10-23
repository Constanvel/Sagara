export type BusinessDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type VerifiedBusinessDetails = {
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
    postalCode?: string;
  };
  hours?: readonly {
    dayOfWeek: readonly BusinessDay[];
    opens: string;
    closes: string;
  }[];
  profiles?: readonly string[];
};

// Intentionally empty until verified facts are also published in visible contact content.
const verifiedBusinessDetails: VerifiedBusinessDetails = {};

export const contact = {
  businessName: "SAGARA Rumah Sunat Modern Banteran",
  siteName: "SAGARA — Rumah Sunat Modern Banteran", // Existing public metadata label, not a new entity name.
  // Add only independently verified facts also published in visible contact content.
  // A map pin/locality is not a street address; confirmation copy is not opening hours.
  verified: verifiedBusinessDetails,
  whatsappNumber: "6287899777219",
  whatsappLabel: "0878 9977 7219",
  whatsappMessage: "Halo admin SAGARA, saya ingin bertanya layanan atau mendaftar khitan.",
  location: "Banteran, Sumbang",
  addressStatus: "SAGARA Rumah Sunat Modern Banteran. Konfirmasi alamat lengkap kepada admin sebelum berkunjung.",
  mapsUrl: "https://maps.app.goo.gl/e89cFM6roqapjt3dA",
  coordinates: { latitude: -7.362495, longitude: 109.2655145 },
  mapsEmbedUrl: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s-7.362495,109.2655145!6i16",
  locationVerification: "Titik lokasi sesuai listing Google Maps SAGARA Rumah Sunat Modern Banteran. Alamat jalan lengkap belum terverifikasi; konfirmasikan kepada admin sebelum berkunjung.",
  hours: "Konfirmasi jam layanan melalui WhatsApp.",
  schedule: "Jadwal kunjungan dibantu oleh admin.",
  homecareDescription: "Diskusikan area layanan bersama admin.",
  homecareMessage: "Halo admin SAGARA, saya ingin menanyakan layanan khitan homecare dan jangkauan area layanannya.",
} as const;
