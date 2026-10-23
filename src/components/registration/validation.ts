export type RegistrationData = {
  service: string; package: string; date: string; time: string;
  guardian: string; patient: string; age: string; whatsapp: string; consent: boolean;
};
export type RegistrationErrors = Partial<Record<keyof RegistrationData, string>>;
export const timeSlots = ["09.00", "10.00", "11.00", "13.00", "14.00", "15.00"];

const jakartaDateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" });
const displayDateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

export function jakartaToday(now = new Date()): string {
  const parts = jakartaDateFormatter.formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
export function formatDate(date: string): string {
  return displayDateFormatter.format(new Date(`${date}T12:00:00+07:00`));
}
export function validateRegistration(data: RegistrationData, serviceIds: string[], packageIds: string[]): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!serviceIds.includes(data.service)) errors.service = "Pilih layanan yang ingin ditanyakan.";
  if (!packageIds.includes(data.package)) errors.package = "Pilih satu paket khitan.";
  const parsed = new Date(`${data.date}T12:00:00+07:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(parsed.getTime()) || jakartaToday(parsed) !== data.date) errors.date = "Pilih tanggal yang valid.";
  else if (data.date < jakartaToday()) errors.date = "Tanggal tidak boleh sebelum hari ini (WIB).";
  if (!timeSlots.includes(data.time)) errors.time = "Pilih satu preferensi waktu.";
  if (data.guardian.trim().length < 2 || data.guardian.trim().length > 100) errors.guardian = "Isi nama orang tua/wali (2–100 karakter).";
  if (data.patient.trim().length < 2 || data.patient.trim().length > 100) errors.patient = "Isi nama pasien (2–100 karakter).";
  if (!/^\d{1,3}$/.test(data.age) || Number(data.age) > 120) errors.age = "Isi usia 0–120 tahun. Untuk bayi, isi 0.";
  const phone = data.whatsapp.replace(/[\s()-]/g, "");
  if (!/^(?:08\d{8,11}|(?:\+62|62)8\d{8,11})$/.test(phone)) errors.whatsapp = "Gunakan nomor Indonesia yang valid, misalnya 081234567890 atau +6281234567890.";
  if (!data.consent) errors.consent = "Setujui penjelasan permintaan konsultasi sebelum melanjutkan.";
  return errors;
}
