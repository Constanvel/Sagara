import { contact } from "@/data/contact";

export function whatsappUrl(message = "Halo admin SAGARA, saya ingin konsultasi khitan."): string | null {
  const number = contact.whatsappNumber;
  if (!/^[1-9]\d{7,14}$/.test(number)) {
    console.error("SAGARA: WhatsApp contact is not configured with a valid international number.");
    return null;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
