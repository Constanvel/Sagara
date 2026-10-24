import Image from "next/image";
import { preload } from "react-dom";
import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import styles from "./HeroSection.module.css";
import { HeroCarousel } from "./HeroCarousel";
import { DecorativeRibbon } from "./DecorativeRibbon";

const highlights = [
  { title: "Pilihan Metode", icon: "imgGroup.svg", copy: "Diskusikan metode Klem dan Biological Glue, termasuk kebutuhan jahitan serta perawatannya, saat konsultasi." },
  { title: "Panduan Perawatan", icon: "imgIcon.svg", copy: "Waktu mandi, penggunaan celana, dan aktivitas setelah khitan mengikuti arahan tenaga medis sesuai kondisi pasien." },
  { title: "Pilihan Pembiusan", icon: "imgVector.svg", copy: "Tanyakan pilihan Comfort-In/Free Needle Injection, manfaat, risiko, dan kesesuaiannya saat konsultasi." },
  { title: "Konsultasi Kondisi", icon: "imgIcon1.svg", copy: "Bahas kebutuhan khitan anak maupun dewasa. Pilihan tindakan dan hasil perawatan dapat berbeda pada setiap pasien." },
];

export function HeroSection() {
  preload("/images/media/sagara-hero-landscape.webp", { as: "image", fetchPriority: "high", media: "(max-width: 1023px)" });
  return <section aria-labelledby="hero-title" className="hero-section relative pb-[88px] lg:bg-[#f4f7fc] lg:pt-3 lg:pb-10">
    <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-12 lg:px-8 lg:pt-10 lg:pb-9">
      <div className={`hero-copy ${styles.copy}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Khitan modern . Banteran</p>
          <div aria-hidden="true" className={styles.mascot}><Image src="/images/media/sagara-hero-mascot-outline.webp" alt="" width={80} height={80} sizes="80px" /><Image src="/images/media/sagara-hero-mascot.webp" alt="" width={76} height={76} sizes="76px" /></div>
          <h1 id="hero-title" className={styles.title}>Langkah berani si jagoan, dimulai di sini.</h1>
          <div className={styles.description}><span aria-hidden="true" className={styles.quoteStart}>“</span><p>Khitan modern bersama SAGARA di Banteran, Sumbang. Kenali pilihan layanan dan konsultasikan rencana perawatan untuk anak maupun dewasa bersama keluarga.</p><span aria-hidden="true" className={styles.quoteEnd}>“</span></div>
        </div>
        <div className={`hero-actions ${styles.actions}`}>
          <Link href="/pendaftaran" className={`cta-motion ${styles.register}`}>
            <span className={styles.registerLabel}>Daftar khitan</span>
            <Asset name="hero-arrow-right.svg" width={21} height={21} className={styles.arrow} />
          </Link>
          <Link href="/paket" className={`cta-motion ${styles.packages}`}>
            <span className={styles.packageLabel}>Lihat paket</span>
            <Asset name="hero-package.svg" width={24} height={24} className={styles.packageIcon} />
          </Link>
        </div>
      </div>
      <HeroCarousel />
    </div>
    <section aria-labelledby="highlights-title" className="mx-auto mt-8 max-w-[1200px] px-[21px] lg:mt-4 lg:px-8">
      <h2 id="highlights-title" className="mb-6 text-center text-[24px] leading-[1.3] font-bold text-ink lg:text-[28px]">Tenang Bersama Sagara</h2>
      <div className="feature-grid grid grid-cols-2 gap-x-[18px] gap-y-[14px] lg:grid-cols-4 lg:gap-4">{highlights.map(item => <article key={item.title} className="min-w-0 rounded-[20px] border border-primary/50 border-b-[3px] border-b-navy bg-[#dee6f3] px-[13px] py-3 lg:p-5"><div className="flex min-h-7 items-start gap-2"><Asset name={item.icon} width={28} height={28} className="h-7 w-7 shrink-0" /><h3 className="text-[13px] leading-5 font-bold text-navy lg:text-[15px]">{item.title}</h3></div><p className="mt-2 text-[11px] leading-[1.6] text-[#434652] lg:text-xs lg:leading-5">{item.copy}</p></article>)}</div>
    </section>
    <div className="absolute right-0 bottom-0 left-0"><DecorativeRibbon /></div>
  </section>;
}
