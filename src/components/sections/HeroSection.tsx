import Image from "next/image";
import Link from "next/link";
import { ContactAction } from "@/components/ui/ContactAction";
import { Asset } from "@/components/ui/Asset";
import styles from "./HeroSection.module.css";

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
  return <section aria-labelledby="hero-title" className="hero-section relative pb-[110px] lg:bg-[#f4f7fc] lg:pt-3 lg:pb-10">
    <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-12 lg:px-8 lg:pt-10 lg:pb-9">
      <div className="hero-copy lg:py-4">
        <div className="bg-soft px-6 pt-6 pb-7 lg:bg-transparent lg:p-0">
          <p className="flex items-center gap-2 text-[11px] font-extrabold text-primary uppercase"><span className="h-[3px] w-[18px] rounded-sm bg-red" />Khitan modern . Banteran</p>
          <h1 id="hero-title" className="mt-[18px] max-w-[364px] text-[32px] leading-[1.23] font-extrabold text-ink lg:max-w-[560px] lg:text-[clamp(2.75rem,4vw,3.5rem)] lg:leading-[1.1] lg:tracking-[-0.045em]"><span className="block lg:inline">Langkah berani si </span><span className="block lg:inline">jagoan, dimulai di </span><span className="block lg:inline">sini.</span></h1>
          <p className="mt-[18px] text-[15px] leading-[1.65] text-muted lg:mt-5 lg:max-w-[460px] lg:text-base lg:leading-7">Khitan modern bersama SAGARA. Kenali pilihan metode dan rencanakan perawatan yang sesuai untuk anak maupun dewasa, bersama keluarga.</p>
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
      <div className="hero-visual mx-auto mt-6 w-[calc(100%-58px)] max-w-[480px] lg:mt-0 lg:w-full lg:max-w-none">
        <div className="rounded-[30px] bg-soft p-[5px] lg:rounded-[32px] lg:bg-white lg:p-2 lg:shadow-[0_16px_48px_rgba(21,61,117,0.09)]">
          <div className="relative aspect-[344/257] overflow-hidden rounded-[30px]">
            <Image src="/images/figma/hero.png" alt="Seorang anak bersama pendamping memegang sertifikat dan hadiah SAGARA." fill priority sizes="(min-width: 1024px) 470px, (max-width: 412px) 85vw, 344px" className="!top-[-41.72%] !left-[-13.49%] !h-[208.28%] !w-[116.68%] max-w-none" />
          </div>
        </div>
        <div className="relative mx-auto -mt-10 w-[90%] rounded-2xl bg-white/95 px-4 py-4 text-center text-[12px] leading-[1.65] text-navy shadow-sm lg:-mt-7 lg:w-[82%] lg:border lg:border-[#e5ebf5] lg:py-3 lg:text-[13px] lg:shadow-[0_8px_24px_rgba(21,61,117,0.06)]"><p className="font-extrabold">Setiap anak punya cerita beraninya.</p><p>Kami hadir untuk menemani langkahnya.</p></div>
      </div>
    </div>
    <div className="feature-grid mx-auto mt-10 grid max-w-[1200px] grid-cols-2 gap-x-[18px] gap-y-[14px] px-[21px] lg:mt-1 lg:grid-cols-4 lg:gap-4 lg:px-8">{highlights.map(item => <article key={item.title} className="min-w-0 rounded-[20px] bg-[#dee6f3] px-[15px] py-3 shadow-[4px_4px_4px_rgba(0,0,0,0.25)] lg:rounded-2xl lg:border lg:border-[#e3eaf5] lg:bg-white lg:p-5 lg:shadow-[0_4px_16px_rgba(21,61,117,0.04)]"><div className="flex min-h-7 items-center gap-2"><Asset name={item.icon} width={28} height={28} className="h-7 w-7 shrink-0" /><h2 className="text-[13px] leading-5 font-bold text-navy lg:text-[15px]">{item.title}</h2></div><p className="mt-2 text-[9px] leading-[15px] text-[#434652] lg:text-xs lg:leading-5">{item.copy}</p></article>)}</div>
    <div className="absolute right-0 bottom-0 left-0"><DecorativeRibbon /></div>
  </section>;
}
