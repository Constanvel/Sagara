import Image from "next/image";
import Link from "next/link";
import { ContactAction } from "@/components/ui/ContactAction";
import { Asset } from "@/components/ui/Asset";
import styles from "./HeroSection.module.css";
import { HeroCarousel } from "./HeroCarousel";

const highlights = [
  { title: "Tanpa Jahit", icon: "imgGroup.svg", copy: "Metode Klem & Biological Glue canggih, hasil luka tertutup presisi tanpa benang jahit." },
  { title: "Langsung Mandi", icon: "imgIcon.svg", copy: "Bebas kena air, bisa langsung main PlayStation, dan mengenakan celana seperti biasa." },
  { title: "Tanpa Suntik", icon: "imgVector.svg", copy: "Teknologi Comfort-in/Free Needle Injection dengan semprotan mikro bebas rasa takut jarum." },
  { title: "Hasil Rapi", icon: "imgIcon1.svg", copy: "Rapi, simetris, dan dirancang khusus oleh praktisi medis bersertifikat khitan anak & dewasa." },
];

export function DecorativeRibbon() {
  return <div aria-hidden="true" className={`pointer-events-none relative w-full overflow-hidden lg:hidden ${styles.ribbon}`}>
    <Image src="/images/figma/hero-ribbon.png" alt="" width={412} height={31} unoptimized className="block h-auto w-full" />
  </div>;
}
export function HeroSection() {
  return <section aria-labelledby="hero-title" className="hero-section relative pb-[88px] lg:bg-[#f4f7fc] lg:pt-3 lg:pb-10">
    <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-12 lg:px-8 lg:pt-10 lg:pb-9">
      <div className={`hero-copy ${styles.copy}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Khitan modern . Banteran</p>
          <div aria-hidden="true" className={styles.mascot}><Image src="/images/figma/hero-mascot-outline.png" alt="" width={80} height={80} unoptimized /><Image src="/images/figma/hero-mascot.png" alt="" width={76} height={76} unoptimized /></div>
          <h1 id="hero-title" className={styles.title}><span>Langkah berani si</span>{" "}<span>jagoan, dimulai di sini.</span></h1>
          <div className={styles.description}><span aria-hidden="true" className={styles.quoteStart}>“</span><p>Khitan modern bersama SAGARA. Kenali pilihan metode dan rencanakan perawatan yang sesuai untuk anak maupun dewasa, bersama keluarga.</p><span aria-hidden="true" className={styles.quoteEnd}>“</span></div>
        </div>
        <div className={`hero-actions ${styles.actions}`}>
          <ContactAction className={styles.register}>
            <span className={styles.registerLabel}>Daftar khitan</span>
            <Asset name="hero-arrow-right.svg" width={21} height={21} className={styles.arrow} />
          </ContactAction>
          <Link href="/paket" className={`cta-motion ${styles.packages}`}>
            <span className={styles.packageLabel}>Lihat paket</span>
            <Asset name="hero-package.svg" width={24} height={24} className={styles.packageIcon} />
          </Link>
        </div>
      </div>
      <HeroCarousel />
    </div>
    <div className="feature-grid mx-auto mt-10 grid max-w-[1200px] grid-cols-2 gap-x-[18px] gap-y-[14px] px-[21px] lg:mt-1 lg:grid-cols-4 lg:gap-4 lg:px-8">{highlights.map(item => <article key={item.title} className="min-w-0 rounded-[20px] bg-[#dee6f3] px-[15px] py-3 shadow-[4px_4px_4px_rgba(0,0,0,0.25)] lg:rounded-2xl lg:border lg:border-[#e3eaf5] lg:bg-white lg:p-5 lg:shadow-[0_4px_16px_rgba(21,61,117,0.04)]"><div className="flex min-h-7 items-center gap-2"><Asset name={item.icon} width={28} height={28} className="h-7 w-7 shrink-0" /><h2 className="text-[13px] leading-5 font-bold text-navy lg:text-[15px]">{item.title}</h2></div><p className="mt-2 text-[9px] leading-[15px] text-[#434652] lg:text-xs lg:leading-5">{item.copy}</p></article>)}</div>
    <div className="absolute right-0 bottom-0 left-0"><DecorativeRibbon /></div>
  </section>;
}
