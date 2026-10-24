import { packagePriceLabel, type KhitanPackage } from "@/data/packages";
import { formatDate, type RegistrationData } from "./validation";

export function normalizeRegistration(data: RegistrationData): RegistrationData {
  return { ...data, guardian: data.guardian.trim(), patient: data.patient.trim(), age: String(Number(data.age)), whatsapp: data.whatsapp.replace(/[\s()-]/g, "") };
}

// Pure formatter: never persist or log this message or its Click-to-Chat URL.
export function registrationMessage(data: RegistrationData, service: string, selectedPackage: KhitanPackage): string {
  return `Halo Admin SAGARA! 👋

Saya ingin mengajukan pendaftaran layanan khitan di SAGARA Rumah Sunat Modern.

📋 INFORMASI PENDAFTARAN

Layanan: ${service}
Paket: ${selectedPackage.name}
Biaya: ${packagePriceLabel(selectedPackage)}
Tanggal yang diinginkan: ${formatDate(data.date)}
Waktu yang diinginkan: ${data.time} WIB

👤 DATA PENDAFTAR

Nama Orang Tua/Wali: ${data.guardian}
Nama Pasien: ${data.patient}
Usia Pasien: ${data.age} tahun
Nomor WhatsApp: ${data.whatsapp}

Mohon konfirmasi ketersediaan jadwal, rincian biaya, dan informasi persiapan yang diperlukan.

Saya memahami bahwa jadwal dan biaya akhir akan dikonfirmasi oleh admin SAGARA.

Terima kasih! 🙏`;
}
