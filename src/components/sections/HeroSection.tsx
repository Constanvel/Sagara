import Image from "next/image";
import Link from "next/link";
import { ContactAction } from "@/components/ui/ContactAction";
import { Asset } from "@/components/ui/Asset";

const highlights = [
  { title: "Tanpa Jahit", icon: "imgGroup.svg", copy: "Metode Klem & Biological Glue canggih, hasil luka tertutup presisi tanpa benang jahit." },
  { title: "Langsung Mandi", icon: "imgIcon.svg", copy: "Bebas kena air, bisa langsung main PlayStation, dan mengenakan celana seperti biasa." },
  { title: "Tanpa Suntik", icon: "imgVector.svg", copy: "Teknologi Comfort-in/Free Needle Injection dengan semprotan mikro bebas rasa takut jarum." },
  { title: "Hasil Rapi", icon: "imgIcon1.svg", copy: "Rapi, simetris, dan dirancang khusus oleh praktisi medis bersertifikat khitan anak & dewasa." },
];

export function HeroSection() {
  return <section aria-labelledby="hero-title" className="pb-[110px] lg:pb-20">
    <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-6 lg:py-16">
      <div>
        <div className="bg-soft px-6 pt-6 pb-7 lg:rounded-3xl lg:p-10">
          <p className="flex items-center gap-2 text-[11px] font-extrabold text-primary uppercase"><span className="h-[3px] w-[18px] rounded-sm bg-red" />Khitan modern . Banteran</p>
          <h1 id="hero-title" className="mt-[18px] max-w-[364px] text-[32px] leading-[1.23] font-extrabold tracking-[-0.5px] text-ink lg:max-w-none lg:text-5xl">Langkah berani si jagoan, dimulai di sini.</h1>
          <p className="mt-[18px] text-[15px] leading-[1.65] text-muted">Khitan modern bersama SAGARA. Kenali pilihan metode dan rencanakan perawatan yang sesuai untuk anak maupun dewasa, bersama keluarga.</p>
        </div>
        <div className="mt-[-5px] flex flex-wrap gap-[15px] px-[22px] lg:mt-6 lg:px-0">
          <ContactAction className="min-h-11 rounded-[8px] bg-primary !px-[13px] !text-[11px] text-white uppercase">Daftar khitan <span aria-hidden="true">→</span></ContactAction>
          <Link href="/paket" className="inline-flex min-h-11 items-center rounded-[8px] bg-[#e7eeff] px-[14px] text-[11px] font-extrabold text-navy uppercase">Lihat paket</Link>
        </div>
      </div>
      <div className="mx-auto mt-6 w-[calc(100%-58px)] max-w-[480px] lg:mt-0 lg:w-full">
        <div className="rounded-[30px] bg-soft p-[5px]">
          <div className="relative aspect-[344/257] overflow-hidden rounded-[30px]">
            <Image src="/images/figma/hero.png" alt="Seorang anak bersama pendamping memegang sertifikat dan hadiah SAGARA." fill priority sizes="(min-width: 1024px) 470px, (max-width: 412px) 85vw, 344px" className="!top-[-41.72%] !left-[-13.49%] !h-[208.28%] !w-[116.68%] max-w-none" />
          </div>
        </div>
        <div className="relative mx-auto -mt-10 w-[90%] rounded-2xl bg-white/95 px-4 py-4 text-center text-[12px] leading-[1.65] text-navy shadow-sm"><p className="font-extrabold">Setiap anak punya cerita beraninya.</p><p>Kami hadir untuk menemani langkahnya.</p></div>
      </div>
    </div>
    <div className="mx-auto mt-10 grid max-w-[1200px] grid-cols-2 gap-x-[18px] gap-y-[14px] px-[21px] lg:mt-4 lg:grid-cols-4 lg:px-6">{highlights.map(item => <article key={item.title} className="min-w-0 rounded-[20px] bg-[#dee6f3] px-[15px] py-3 shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"><div className="flex min-h-7 items-center gap-2"><Asset name={item.icon} width={28} height={28} className="h-7 w-7 shrink-0" /><h2 className="text-[13px] leading-5 font-bold text-navy lg:text-[15px]">{item.title}</h2></div><p className="mt-2 text-[9px] leading-[15px] text-[#434652] lg:text-xs lg:leading-5">{item.copy}</p></article>)}</div>
  </section>;
}
