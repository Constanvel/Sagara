import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { contact } from "@/data/contact";
import { whatsappUrl } from "@/lib/whatsapp";

export function ContactSection() {
  const whatsappHref = whatsappUrl(contact.whatsappMessage);
  const whatsappCard = (
    <>
      <span className="flex size-[53px] shrink-0 items-center justify-center rounded-[15px] bg-white/20">
        <Asset name="contact-whatsapp.svg" width={29} height={27.3692} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-[1.65] font-semibold text-white/80">WHATSAPP SAGARA</span>
        <span className="block whitespace-nowrap text-[21px] leading-[1.23] font-extrabold">{contact.whatsappLabel}</span>
        <span className="mt-[5px] block text-[11px] leading-[1.65] font-semibold text-white/80">Tanya layanan atau daftar khitan</span>
      </span>
      <span className="ml-auto shrink-0 -rotate-[51.1deg]">
        <Asset name="contact-wa-arrow.svg" width={12.2917} height={12.0846} />
      </span>
      <span className="sr-only"> (WhatsApp, tab baru)</span>
    </>
  );
  const whatsappClass = "flex min-h-[99px] items-center gap-[14px] rounded-[20px] bg-primary px-6 py-[13px] text-white hover:bg-navy";

  return (
    <section aria-labelledby="contact-heading" className="mx-auto max-w-[1100px] px-6 pt-6 pb-[61px] lg:px-8 lg:py-14">
      <div className="flex items-center gap-2 text-[11px] leading-[14px] font-extrabold text-primary uppercase">
        <span aria-hidden="true" className="h-[3px] w-[18px] rounded-sm bg-red" />
        Lokasi &amp; kontak
      </div>
      <h1 id="contact-heading" className="mt-[3px] text-[32px] leading-[1.23] font-extrabold tracking-[-0.6px] lg:text-5xl">Mari berkunjung.</h1>
      <p className="text-sm leading-[1.65] text-muted lg:mt-3">Temukan lokasi dan hubungi tim Sagara</p>

      <div className="mx-auto mt-[21px] grid max-w-[342px] gap-[35px] lg:mt-10 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:gap-y-6">
        <div className="lg:col-start-1 lg:row-start-1">
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={whatsappClass}>{whatsappCard}</a>
          ) : (
            <span aria-disabled="true" className={whatsappClass}>{whatsappCard}<span className="sr-only">Kontak belum tersedia</span></span>
          )}
        </div>

        <div className="rounded-[20px] bg-white px-[12.5px] pt-[18px] pb-4 lg:col-start-2 lg:row-span-3 lg:row-start-1">
          <div className="px-[11px]">
            <h2 className="flex items-center gap-[6px] text-sm leading-[22px] font-bold text-primary">
              <Asset name="contact-location.svg" width={16.64} height={22.1} />
              Lokasi Sagara
            </h2>
            <p className="mt-[10px] text-base leading-5 font-extrabold text-primary">{contact.location}</p>
            <p className="mt-[6px] text-[11px] leading-[18px] font-semibold text-[#656565]">{contact.addressStatus}</p>
          </div>
          <div aria-hidden="true" className="mt-[17px] rounded-[15px] border border-[#3982da]/30 bg-[#3982da]/10 p-[10px]">
            <div className="relative aspect-[295/113] overflow-hidden rounded-[20px]">
              <Asset name="contact-map.png" width={295} height={339} className="absolute top-[-62.69%] left-0 h-[299.43%]! w-full max-w-none" />
            </div>
          </div>
          <button type="button" disabled aria-disabled="true" aria-describedby="location-verification" className="mt-3 flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-[7px] rounded-[15px] border border-[#3982da]/30 bg-[#3982da]/10 text-base font-medium text-[#727780]">
            Petunjuk Arah
            <span className="-rotate-[51.1deg]"><Asset name="contact-directions-arrow.svg" width={13.4988} height={13.0846} /></span>
          </button>
          <p id="location-verification" className="sr-only">{contact.locationVerification}</p>
        </div>

        <div className="-mt-[3px] rounded-2xl bg-white px-5 pt-5 pb-[11px] shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] lg:col-start-1 lg:row-start-2 lg:mt-0">
          <h2 className="flex items-center gap-[10px] text-[15px] leading-[19px] font-semibold text-[#374151]">
            <Asset name="contact-clock.svg" width={17.0012} height={17.0012} />
            Jam layanan
          </h2>
          <p className="mt-2 text-[13px] leading-4 text-[#6b7280]">{contact.hours}</p>
          <p className="mt-2 text-[13px] leading-4 text-[#6b7280]">{contact.schedule}</p>
        </div>

        <div className="-mt-3 rounded-2xl bg-white p-5 shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] lg:col-start-1 lg:row-start-3 lg:mt-0">
          <h2 className="flex items-center gap-2 text-[15px] leading-[19px] font-semibold text-[#374151]">
            <Asset name="contact-home.svg" width={18} height={18} />
            Ingin khitan di rumah?
          </h2>
          <p className="mt-2 text-[13px] leading-4 text-[#6b7280]">{contact.homecareDescription}</p>
          <ContactAction message={contact.homecareMessage} className="relative mt-2 min-h-0! justify-start! gap-1! rounded-none! p-0! text-[13px]! leading-4 text-[#1e40af] after:absolute after:inset-x-0 after:-inset-y-[14px]">
            Tanyakan homecare
            <Asset name="contact-arrow.svg" width={14} height={14} />
          </ContactAction>
        </div>
      </div>
    </section>
  );
}
