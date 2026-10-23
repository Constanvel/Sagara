import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Pendaftaran",
  "Ajukan preferensi jadwal khitan SAGARA. Jadwal dan biaya dikonfirmasi oleh admin melalui WhatsApp.",
  "/pendaftaran",
);

export default function RegistrationPage() {
  return <RegistrationForm />;
}
