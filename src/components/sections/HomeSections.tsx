import Image from "next/image";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { benefits, methods, needs } from "@/data/home";
import { whatsappUrl } from "@/lib/whatsapp";
import { contact } from "@/data/contact";
import { FAQAccordion } from "./FAQAccordion";
import { DecorativeRibbon } from "./HeroSection";

const container = "mx-auto w-full max-w-[1200px]";
const action = "min-h-[50px] rounded-xl border px-[18px] py-[13px] text-sm font-bold";

function SectionIntro({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <div className="section-intro flex max-w-[720px] flex-col gap-3 lg:max-w-[640px] lg:gap-3.5">
      <p className="flex items-center gap-2 text-[11px] font-extrabold text-primary uppercase">
        <span aria-hidden="true" className="h-[3px] w-[18px] rounded-sm bg-[#d91f26]" />
        {label}
      </p>
      <h2 className="text-[28px] leading-[1.23] font-extrabold text-ink lg:text-[36px] lg:leading-[1.15] lg:tracking-[-0.035em]">{title}</h2>
      {description && <p className="text-[15px] leading-[1.65] text-muted">{description}</p>}
    </div>
  );
}

export function MethodsSection() {
  return (
    <section id="metode" aria-labelledby="methods-title" className="content-section methods-section relative px-[18px] pt-12 pb-[39px] md:px-8 md:py-20 lg:py-14">
      <div className={container}>
        <div className="section-intro max-w-[720px] lg:grid lg:max-w-none lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-x-14">
          <p className="text-xs leading-5 font-bold tracking-[0.75px] text-[#db322f] uppercase lg:col-span-2">Pilihan Prosedur Modern</p>
          <h2 id="methods-title" className="mt-[10px] text-2xl leading-[25px] font-extrabold tracking-[-0.54px] text-navy lg:mt-3 lg:max-w-[540px] lg:text-[36px] lg:leading-[1.15] lg:tracking-[-0.035em]">Metode Khitan Unggulan Sagara Banteran</h2>
          <p className="mt-5 text-xs leading-[15px] text-muted lg:mt-0 lg:max-w-[460px] lg:pb-1 lg:text-[15px] lg:leading-6">Kami menyediakan ragam metode khitan modern terstandar medis internasional yang disesuaikan dengan anatomi, usia, dan kenyamanan anak Anda.</p>
        </div>
        <div className="feature-grid mx-[2px] mt-10 grid gap-y-16 md:mx-0 md:grid-cols-3 md:gap-6 lg:mt-8 lg:gap-5">
          {methods.map((method, index) => (
            <article key={method.title} className={`flex min-w-0 flex-col justify-between rounded-2xl bg-[#f0f2f6] p-6 shadow-sm ${index === 0 ? "min-h-[418px]" : "min-h-[446px]"} ${index === 2 ? "mt-[5px] md:mt-0" : ""} lg:min-h-[360px] lg:border lg:border-[#e3eaf5] lg:bg-[#f7f9fc] lg:p-6 lg:shadow-[0_4px_18px_rgba(21,61,117,0.04)]`}>
              <div>
                <div className="mb-4 flex min-h-10 items-center justify-between gap-2">
                  {method.badge ? <span className={`rounded-full px-3 py-1 text-[11px] leading-4 font-bold tracking-[0.44px] ${index === 0 ? "bg-[#ffdad6] text-[#b7131a]" : "bg-[#dae2ff] text-navy"}`}>{method.badge}</span> : <span />}
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7eeff]"><Asset name={method.icon} width={19} height={index === 0 ? 24 : index === 1 ? 16 : 19} /></span>
                </div>
                <h3 className="max-w-[280px] text-xl leading-7 font-bold text-navy">{method.title}</h3>
                <p className="mt-2 text-sm leading-5 text-muted">{method.description}</p>
                <ul className="mt-6 flex flex-col gap-2 text-sm leading-5 text-muted lg:mt-4">
                  {method.bullets.map((bullet) => <li key={bullet} className="flex items-start gap-2"><Asset name="imgContainer1.svg" width={15} height={15} className="mt-0.5 shrink-0" /><span>{bullet}</span></li>)}
                </ul>
              </div>
              <ContactAction message={method.action} className="mt-6 w-full bg-[#e7eeff] text-[13px] leading-[18px] font-semibold tracking-[0.26px] text-navy">{method.action}</ContactAction>
            </article>
          ))}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0"><DecorativeRibbon /></div>
    </section>
  );
}

export function NeedsSection() {
  return (
    <section id="layanan" className="content-section bg-soft px-6 py-12 md:px-8 md:py-20 lg:py-14">
      <div className={`${container} flex flex-col gap-7 lg:gap-8`}>
        <SectionIntro label="Layanan SAGARA" title="Setiap jagoan punya kebutuhan berbeda." description="Mulai dari kebutuhan Anda. Kelayakan tindakan dan pilihan metode ditentukan setelah konsultasi." />
        <div className="feature-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {needs.map((need) => (
            <article key={need.title} className="relative flex min-w-0 flex-col gap-[14px] rounded-[20px] border border-line bg-white p-5 shadow-[0_6px_24px_rgba(21,61,117,0.06)] lg:gap-3 lg:p-6 lg:shadow-[0_4px_16px_rgba(21,61,117,0.035)]">
              <div className="flex items-center justify-between"><span className="flex size-[42px] items-center justify-center rounded-xl bg-soft"><Asset name={need.icon} width={22} height={22} /></span><Asset name="imgArrowUpRight.svg" width={18} height={18} /></div>
              <h3 className="text-[19px] leading-[1.23] font-extrabold text-ink"><a href={whatsappUrl(`Halo admin SAGARA, saya ingin konsultasi layanan ${need.title}.`) ?? undefined} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-[20px]">{need.title}<span className="sr-only"> — konsultasi WhatsApp (tab baru)</span></a></h3>
              <p className="text-[13px] leading-[1.65] text-muted">{need.description}</p>
            </article>
          ))}
          <div className="flex min-w-0 flex-col items-start gap-4 rounded-[20px] bg-primary p-6 text-white">
            <h3 className="text-[21px] leading-[1.23] font-extrabold">Belum tahu layanan yang sesuai?</h3>
            <p className="text-[13px] leading-[1.65]">Admin siap membantu Anda memulai konsultasi.</p>
            <ContactAction className={`${action} max-w-full border-white bg-white text-primary`}><Asset name="imgArrowRight.svg" width={19} height={19} className="shrink-0" />Tanya Admin Via WhatsApp</ContactAction>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="content-section bg-soft px-6 py-12 md:px-8 md:py-20 lg:py-14">
      <div className={`${container} flex flex-col gap-7 lg:gap-8`}>
        <SectionIntro label="Lebih dari tindakan" title="Bekal untuk jagoan. Dukungan untuk keluarga." />
        <div className="feature-grid grid w-full max-w-[342px] grid-cols-2 gap-3 md:max-w-none md:grid-cols-3 lg:grid-cols-3 lg:gap-5">
          {benefits.map((benefit) => <article key={benefit.title} className="flex min-w-0 flex-col items-start gap-3 rounded-[20px] bg-white p-4 lg:grid lg:grid-cols-[40px_1fr] lg:gap-x-3 lg:gap-y-2 lg:rounded-2xl lg:border lg:border-[#e3eaf5] lg:p-5 lg:shadow-[0_4px_16px_rgba(21,61,117,0.03)] lg:[&>img]:row-span-2 lg:[&>img]:mt-1 lg:[&>h3]:text-base lg:[&>p]:col-start-2 lg:[&>p]:text-[13px]"><Asset name={benefit.icon} width={25} height={25} className="shrink-0" /><h3 className="text-[15px] leading-[1.23] font-extrabold text-ink">{benefit.title}</h3><p className="text-xs leading-[1.65] text-muted">{benefit.description}</p></article>)}
        </div>
        <p className="text-xs leading-[1.65] text-muted">Fasilitas mengikuti informasi promosi SAGARA. Konfirmasikan rincian dan ketersediaan hadiah dengan admin saat reservasi.</p>
      </div>
    </section>
  );
}

export function HomecareSection() {
  return (
    <section id="homecare" className="content-section homecare-section px-6 py-12 md:px-8 md:py-20 lg:py-14">
      <div className={`${container} grid items-center gap-8 md:grid-cols-2 lg:gap-12 lg:rounded-[28px] lg:border lg:border-[#e3eaf5] lg:bg-[#f7f9fc] lg:p-10`}>
        <div className="flex flex-col items-start gap-5">
          <SectionIntro label="SAGARA homecare" title="Pilihan khitan, dari rumah." description="Ingin khitan di rumah? Diskusikan kebutuhan keluarga Anda bersama admin SAGARA" />
          <p className="text-sm leading-[1.65] text-muted">Ketersediaan area, jadwal, kesiapan tempat, dan kelayakan layanan dikonfirmasi setelah konsultasi.</p>
          <ContactAction message="Saya ingin menanyakan layanan homecare." className={`${action} border-primary bg-primary text-white`}><Asset name="imgMessageCircle.svg" width={19} height={19} className="shrink-0" />Tanyakan layanan homecare</ContactAction>
        </div>
        <div className="homecare-visual relative mx-auto min-h-[226px] w-full max-w-[342px] rounded-[28px] bg-soft p-6 lg:min-h-[280px] lg:max-w-[440px] lg:bg-white lg:p-7 lg:shadow-[0_8px_28px_rgba(21,61,117,0.05)]">
          <p className="flex items-center gap-2 text-[15px] font-extrabold text-primary"><Asset name="imgHouseHeart.svg" width={22} height={22} className="shrink-0" />SAGARA datang ke rumah</p>
          <div className="absolute top-[69px] right-[10px] left-[7px] h-[133px] overflow-hidden lg:top-[86px] lg:right-4 lg:left-4 lg:h-[170px]" role="img" aria-label="Kendaraan layanan homecare SAGARA">
            <Asset name="imgImage16.png" sizes="(min-width: 1024px) 408px, 325px" width={1774} height={887} className="absolute -top-[12.03%] left-0 h-auto w-full max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="content-section bg-soft px-6 py-12 md:px-8 md:py-20 lg:py-14">
      <div className={`${container} grid items-start gap-7 md:grid-cols-[0.85fr_1.15fr] md:gap-12`}>
        <div className="flex flex-col items-start gap-[22px]">
          <SectionIntro label="Tanya SAGARA" title="Masih ada yang ingin ditanyakan?" description="Ini beberapa hal yang sering ingin diketahui keluarga sebelum memulai." />
          <ContactAction className={`${action} border-line bg-white text-primary`}><Asset name="imgMessageCircle1.svg" width={19} height={19} className="shrink-0" />Tanya admin SAGARA</ContactAction>
        </div>
        <FAQAccordion />
      </div>
    </section>
  );
}

export function ConsultationSection() {
  return (
    <section id="konsultasi" className="bg-primary px-6 py-10 text-white md:px-8 md:py-16">
      <div className={`${container} flex flex-col gap-7 md:flex-row md:items-center md:justify-between`}>
        <div className="flex max-w-[720px] flex-col gap-[14px]">
          <p className="text-[11px] font-extrabold">LANGKAH PERTAMA, TANYA DULU.</p>
          <h2 className="text-[30px] leading-[1.23] font-extrabold">Siap merencanakan khitan bersama SAGARA?</h2>
          <p className="text-sm leading-[1.65]">Konsultasikan kebutuhan, pilihan metode, dan biaya bersama admin Sagara.</p>
        </div>
        <ContactAction className={`${action} w-full shrink-0 border-white bg-white text-primary md:w-auto`}><Asset name="imgMessageCircle2.svg" width={19} height={19} className="shrink-0" />Mulai konsultasi</ContactAction>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="kontak" className="bg-soft px-6 py-9 md:px-8">
      <div className={`${container} flex flex-col gap-6`}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-8">
          <div className="flex max-w-[440px] flex-col items-start gap-3">
            <Image src="/images/media/sagara-footer-logo-transparan.webp" alt="Logo SAGARA Rumah Sunat Modern Banteran" width={1920} height={819} sizes="(min-width: 768px) 240px, 210px" loading="lazy" className="h-auto w-[210px] max-w-full object-contain md:w-[240px]" />
            <p className="text-xs leading-[1.65] text-muted">Rumah Sunat Modern Banteran, Sumbang. Teman keluarga dalam merencanakan khitan.</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-[13px]">
            <nav aria-label="Tautan penutup" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-primary">
              <a href="/layanan">Layanan</a><span aria-hidden="true">·</span><a href="/galeri">Galeri</a><span aria-hidden="true">·</span><a href="/kontak">Lokasi &amp; Kontak</a>
            </nav>
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Lokasi SAGARA di Google Maps<span className="sr-only"> (dibuka di tab baru)</span></a>
            <ContactAction className="!min-h-11 !rounded-none !p-0 !text-[13px] !font-normal text-ink">WhatsApp 0878 9977 7219</ContactAction>
          </div>
          <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Lihat lokasi SAGARA di Google Maps (dibuka di tab baru)" className="group block w-full max-w-[360px] overflow-hidden rounded-[20px] border border-[#3982da]/30 bg-white p-3 text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 md:col-span-2 md:max-w-none lg:col-span-1 lg:max-w-[360px]">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold"><Asset name="contact-location.svg" width={17} height={23} />Lokasi Sagara</span>
            <span className="relative block h-[140px] overflow-hidden rounded-[15px] bg-[#3982da]/10 md:h-[160px]">
              <Image src="/images/media/sagara-banteran-map-preview.webp" alt="Preview peta lokasi SAGARA di Banteran" fill sizes="(min-width: 1024px) 320px, (min-width: 768px) 640px, 320px" loading="lazy" className="object-cover object-[center_30%]" />
            </span>
            <span className="mt-2 flex items-center justify-between gap-2 text-xs"><span>Banteran, Sumbang</span><span className="font-semibold underline underline-offset-4">Petunjuk arah</span></span>
          </a>
        </div>
        <div className="h-px bg-line" />
        <p className="text-[10px] leading-[1.65] text-muted">© SAGARA — Rumah Sunat Modern Banteran. Informasi di website tidak menggantikan konsultasi dan penilaian kondisi pasien.</p>
      </div>
    </footer>
  );
}
