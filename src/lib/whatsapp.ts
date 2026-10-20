const approvedNumber = "6287899777219";

export function whatsappUrl(message = "Halo admin SAGARA, saya ingin konsultasi khitan."): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? approvedNumber;
  if (!/^[1-9]\d{7,14}$/.test(number)) {
    console.error("SAGARA: WhatsApp contact is not configured with a valid international number.");
    return null;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
