import type { Metadata } from "next";
import { Suspense } from "react";
import { RegistrationForm } from "@/components/registration/RegistrationForm";

export const metadata: Metadata = {
  title: "Pendaftaran",
  description: "Ajukan preferensi jadwal khitan SAGARA. Jadwal dan biaya dikonfirmasi oleh admin melalui WhatsApp.",
};

export default function RegistrationPage() {
  return <Suspense fallback={<main id="main-content" className="mx-auto min-h-screen max-w-[1120px] p-6"><h1>Memuat formulir pendaftaran…</h1></main>}><RegistrationForm /></Suspense>;
}
