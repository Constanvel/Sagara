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

export function DecorativeRibbon() {
  return <div aria-hidden="true" className="pointer-events-none relative h-[30px] w-full overflow-hidden lg:hidden">
    <div className="absolute top-0 left-1/2 h-[30px] w-[412px] -translate-x-1/2">
      <div className="absolute top-[6.4px] left-[-0.5px] h-[14.46px] w-[412.965px] rotate-[-1.78deg] skew-x-[-0.58deg] bg-[#003d9f]" />
      {[
        { left: 323.06, top: -54.76, mask: "imgWaveRibbon6.svg", position: "-97.4px 54.758px", size: "186.903px 20.258px" },
        { left: 215.64, top: -49.29, mask: "imgWaveRibbon6.svg", position: "10.022px 49.293px", size: "186.903px 20.258px" },
        { left: -3.16, top: -41.75, mask: "imgWaveRibbon3.svg", position: "-6.535px 50.943px", size: "206.924px 20.88px" },
        { left: 121.77, top: -45.85, mask: "imgWaveRibbon3.svg", position: "-131.467px 55.046px", size: "206.924px 20.88px" },
      ].map(tile => <div key={tile.left} className="absolute flex h-[120.616px] w-[120.596px] items-center justify-center" style={{ left: tile.left, top: tile.top }}>
        <div className="h-[85.569px] w-[85.36px] shrink-0 rotate-[41.25deg]" style={{ maskImage: `url(/images/figma/${tile.mask})`, maskPosition: tile.position, maskSize: tile.size, maskRepeat: "no-repeat" }}>
          <Asset name="imgWaveRibbon7.png" width={86} height={86} className="h-full w-full object-cover opacity-60" />
        </div>
      </div>)}
      <div className="absolute top-[6.41px] left-[-0.5px] h-[14.461px] w-[412.947px] rotate-[1.53deg] skew-x-[0.5deg] bg-[#002869]" />
      <span className="absolute top-[9px] left-[196px] rotate-[1.52deg] text-[5px] leading-[8px] font-extrabold tracking-[-0.5px] text-white">SAGARA</span>
    </div>
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
        <div className="mt-[-5px] flex flex-wrap gap-[15px] px-[22px] hero-actions lg:mt-7 lg:gap-3 lg:px-0 lg:[&>a]:min-h-12 lg:[&>a]:rounded-xl lg:[&>a]:px-5! lg:[&>a]:text-xs!">
          <ContactAction className="min-h-11 rounded-[8px] bg-primary !px-[13px] !text-[11px] text-white uppercase">Daftar khitan <span aria-hidden="true">→</span></ContactAction>
          <Link href="/paket" className="inline-flex min-h-11 items-center rounded-[8px] bg-[#e7eeff] px-[14px] text-[11px] font-extrabold text-navy uppercase">Lihat paket</Link>
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
