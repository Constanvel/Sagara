import Image from "next/image";
import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { contact } from "@/data/contact";

const container = "mx-auto w-full max-w-[1200px]";

export function Footer() {
  return (
    <footer id="kontak" className="bg-soft px-6 py-9 md:px-8">
      <div className={`${container} flex flex-col gap-6`}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-8">
          <div className="flex max-w-[440px] flex-col items-start gap-3">
            <Image src="/images/media/sagara-footer-logo-transparan.webp" alt="Logo SAGARA Rumah Sunat Modern Banteran" width={1920} height={819} sizes="(min-width: 768px) 240px, 210px" loading="lazy" className="h-auto w-[210px] max-w-full object-contain md:w-[240px]" />
            <p className="text-xs leading-[1.65] text-muted">Rumah Sunat Modern {contact.location}. Teman keluarga dalam merencanakan khitan.</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-[13px]">
            <nav aria-label="Tautan penutup" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-primary">
              <a href="/layanan">Layanan</a><span aria-hidden="true">·</span><a href="/galeri">Galeri</a><span aria-hidden="true">·</span><a href="/kontak">Lokasi &amp; Kontak</a><span aria-hidden="true">·</span><Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            </nav>
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Lokasi SAGARA di Google Maps<span className="sr-only"> (dibuka di tab baru)</span></a>
            <ContactAction className="!min-h-11 !rounded-none !p-0 !text-[13px] !font-normal text-ink">WhatsApp {contact.whatsappLabel}</ContactAction>
          </div>
          <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Lihat lokasi SAGARA di Google Maps (dibuka di tab baru)" className="group block w-full max-w-[360px] overflow-hidden rounded-[20px] border border-[#3982da]/30 bg-white p-3 text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 md:col-span-2 md:max-w-none lg:col-span-1 lg:max-w-[360px]">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold"><Asset name="contact-location.svg" width={17} height={23} />Lokasi Sagara</span>
            <span className="relative block h-[140px] overflow-hidden rounded-[15px] bg-[#3982da]/10 md:h-[160px]">
              <Image src="/images/media/sagara-banteran-map-preview.webp" alt="Preview peta lokasi SAGARA di Banteran" fill sizes="(min-width: 1264px) 334px, (min-width: 1024px) calc((100vw - 128px) / 3.15 - 26px), (min-width: 768px) calc(100vw - 90px), (min-width: 408px) 334px, calc(100vw - 74px)" loading="lazy" className="object-cover object-[center_30%]" />
            </span>
            <span className="mt-2 flex items-center justify-between gap-2 text-xs"><span>{contact.location}</span><span className="font-semibold underline underline-offset-4">Petunjuk arah</span></span>
          </a>
        </div>
        <div className="h-px bg-line" />
        <p className="text-[10px] leading-[1.65] text-muted">© SAGARA — Rumah Sunat Modern Banteran. Informasi di website tidak menggantikan konsultasi dan penilaian kondisi pasien.</p>
      </div>
    </footer>
  );
}
