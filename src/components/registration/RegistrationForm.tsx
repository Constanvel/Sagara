"use client";

import Link from "next/link";
import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Asset } from "@/components/ui/Asset";
import { packages, packageCaveat, packagePriceLabel } from "@/data/packages";
import { services } from "@/data/services";
import { whatsappUrl } from "@/lib/whatsapp";
import { formatDate, jakartaToday, timeSlots, validateRegistration, type RegistrationData, type RegistrationErrors } from "./validation";
import { normalizeRegistration, registrationMessage } from "./message";
import styles from "./RegistrationForm.module.css";

const registrationServices = services.filter((item, index, all) => all.findIndex(other => other.title === item.title) === index);
const initial: RegistrationData = { service: "anak-anak", package: "", date: "", time: "", guardian: "", patient: "", age: "", whatsapp: "", consent: false };

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const title = useRef<HTMLHeadingElement>(null);
  function moveTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => { title.current?.focus({ preventScroll: true }); title.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  }

  return <main id="main-content" className={styles.main}>
    <div className={styles.container}>
      <div className={styles.topline}><span className={styles.eyebrow}>PENDAFTARAN</span><Link href="/" className={styles.home}>Kembali Beranda <Asset name="registration/arrow.svg" width={14} height={14} /></Link></div>
      <header className={styles.intro}>
        <h1 ref={title} tabIndex={-1}>{step === 1 ? <>Atur waktu<br />untuk langkah berani.</> : step === 2 ? "Tinjau pendaftaran Anda." : "Lanjutkan bersama admin."}</h1>
        <p>{step === 1 ? "Pilih jadwal yang diinginkan. Ketersediaan akhir dikonfirmasi oleh admin." : step === 2 ? "Periksa kembali pilihan dan data sebelum membuka WhatsApp admin." : "Lanjutkan pengiriman di WhatsApp. Permintaan belum otomatis terkirim dan jadwal belum dikonfirmasi."}</p>
      </header>
      <Suspense fallback={<p className="mt-4 text-sm">Baca <Link href="/kebijakan-privasi" className="text-primary underline underline-offset-4">Kebijakan Privasi</Link> sebelum membagikan data. Aktifkan JavaScript untuk menggunakan formulir.</p>}>
        <RegistrationFields step={step} moveTo={moveTo} />
      </Suspense>
    </div>
  </main>;
}

function RegistrationFields({ step, moveTo }: { step: number; moveTo: (next: number) => void }) {
  const params = useSearchParams();
  const [data, setData] = useState(() => {
    const requestedService = params.get("layanan");
    const serviceId = requestedService === "kebutuhan-khusus-pendampingan" ? "kebutuhan-khusus" : requestedService;
    const packageId = params.get("paket");
    return { ...initial,
      service: registrationServices.some(item => item.id === serviceId) ? serviceId! : initial.service,
      package: packages.some(item => item.id === packageId) ? packageId! : initial.package,
    };
  });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [shareConsent, setShareConsent] = useState(false);
  const [today, setToday] = useState(() => jakartaToday());
  const form = useRef<HTMLFormElement>(null);
  const service = registrationServices.find(item => item.id === data.service);
  const selectedPackage = packages.find(item => item.id === data.package);

  function update<K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) {
    setShareConsent(false);
    setData(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }
  function review(event: FormEvent) {
    event.preventDefault();
    setToday(jakartaToday());
    const nextErrors = validateRegistration(data, registrationServices.map(item => item.id), packages.map(item => item.id));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setData(normalizeRegistration(data));
    setShareConsent(false);
    moveTo(2);
  }
  const message = step > 1 && service && selectedPackage ? registrationMessage(data, service.title, selectedPackage.name) : "";
  // Do not expose personal data in an external URL until the user explicitly agrees.
  const href = shareConsent && message ? whatsappUrl(message) : null;
  function openWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
    const nextErrors = validateRegistration(data, registrationServices.map(item => item.id), packages.map(item => item.id));
    if (!shareConsent || !href || Object.keys(nextErrors).length) {
      event.preventDefault();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) moveTo(1);
      return;
    }
    moveTo(3);
  }
  const error = (key: keyof RegistrationData) => errors[key] ? <p id={`error-${key}`} className={styles.error}>{errors[key]}</p> : null;
  const attrs = (key: keyof RegistrationData) => ({ "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `error-${key}` : undefined });
  const fields = [
    { key: "guardian", label: "Nama orang tua / wali", placeholder: "Nama Lengkap", type: "text", autoComplete: "name" },
    { key: "patient", label: "Nama pasien", placeholder: "Nama Lengkap", type: "text", autoComplete: "off" },
    { key: "age", label: "Usia (tahun)", placeholder: "Contoh: 7", type: "number", autoComplete: "off" },
    { key: "whatsapp", label: "Nomor WhatsApp", placeholder: "08XXXXXXXXX", type: "tel", autoComplete: "tel" },
  ] as const;

  return <>
      <ol className={styles.stepper} aria-label="Tahap pendaftaran">{["Jadwal & data", "Tinjau", "Lanjut ke WhatsApp"].map((label, index) => <li key={label} data-state={step === index + 1 ? "active" : step > index + 1 ? "completed" : "upcoming"} aria-current={step === index + 1 ? "step" : undefined}><span className={styles.stepNumber}>{step > index + 1 ? "✓" : index + 1}</span><span>{label}</span></li>)}</ol>
      {step === 1 && <form ref={form} noValidate onSubmit={review} className={styles.form}>
        <div className={styles.field}><label htmlFor="service">Layanan</label><div className={styles.selectWrap}><select id="service" name="service" value={data.service} onChange={event => update("service", event.target.value)} {...attrs("service")}>{registrationServices.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select><Asset name="registration/chevron.svg" width={24} height={24} /></div>{error("service")}</div>
        <fieldset className={styles.packageField}><legend>Pilih paket khitan</legend><p className={styles.helper}>Pilih satu paket yang ingin Anda tanyakan.</p>
          <div className={styles.packages}>{packages.map(item => <article key={item.id} className={styles.package} data-selected={data.package === item.id} data-price-status={item.priceStatus}>
            <h2 className={styles.badge} data-tone={item.tone}>{item.name}</h2><p className={styles.price}>{packagePriceLabel}</p><p className={styles.perPatient}>Harga belum dikonfirmasi</p>
            <ul>{item.features.map(feature => <li key={feature}><Asset name="registration/tick.svg" width={15} height={15} /><span>{feature}</span></li>)}</ul>
            <button type="button" aria-pressed={data.package === item.id} aria-label={`Pilih ${item.name}`} onClick={() => update("package", item.id)} {...attrs("package")}>{data.package === item.id ? "Paket dipilih ✓" : "Pilih paket"}</button>
          </article>)}</div>{error("package")}<p className={styles.caveat} id="package-price-status">{packageCaveat}</p>
        </fieldset>
        <div className={styles.details}>
          <section className={styles.schedule} aria-label="Preferensi jadwal">
            <div className={styles.field}><label htmlFor="date">Tanggal yang diinginkan</label><div className={styles.dateWrap}><input id="date" name="date" type="date" min={today} value={data.date} onFocus={() => setToday(jakartaToday())} onChange={event => update("date", event.target.value)} required {...attrs("date")} /><Asset name="registration/calendar.svg" width={16} height={18} /></div>{error("date")}</div>
            <fieldset className={styles.timeField}><legend>Pilihan waktu</legend><div className={styles.times}>{timeSlots.map(time => <button key={time} type="button" aria-pressed={data.time === time} onClick={() => update("time", time)} {...attrs("time")}>{time}</button>)}</div>{error("time")}<p className={styles.caveat}>Waktu dalam WIB, sebagai preferensi. Ketersediaan dikonfirmasi admin, bukan jadwal real-time.</p></fieldset>
          </section>
          <section className={styles.personal} aria-label="Data pendaftar">{fields.map(field => <div key={field.key} className={styles.field} data-field={field.key}><label htmlFor={field.key}>{field.label}</label><input id={field.key} name={field.key} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} maxLength={field.type === "text" ? 100 : undefined} min={field.key === "age" ? 0 : undefined} max={field.key === "age" ? 120 : undefined} step={field.key === "age" ? 1 : undefined} inputMode={field.key === "age" ? "numeric" : field.key === "whatsapp" ? "tel" : "text"} value={data[field.key]} onChange={event => update(field.key, event.target.value)} required {...attrs(field.key)} />{error(field.key)}</div>)}</section>
        </div>
        <div className={styles.consent}><label><input type="checkbox" checked={data.consent} onChange={event => update("consent", event.target.checked)} {...attrs("consent")} /><span>Saya memahami ini permintaan konsultasi, bukan konfirmasi jadwal. Isian formulir dikelola dalam memori halaman (state React), bukan disimpan ke basis data pendaftaran situs ini. Saya dapat meninjau dan menyetujui pembagian data melalui WhatsApp pada langkah berikutnya.</span></label>{error("consent")}<p className={styles.caveat}>Riwayat dan autofill browser serta pemrosesan oleh layanan pihak ketiga berada di luar kendali formulir ini. Baca <Link href="/kebijakan-privasi" className="font-semibold text-primary underline underline-offset-4">Kebijakan Privasi</Link> sebelum membagikan data.</p></div>
        {Object.keys(errors).some(key => errors[key as keyof RegistrationData]) && <p role="alert" className={styles.error}>Periksa isian yang ditandai sebelum melanjutkan.</p>}
        <button type="submit" className={styles.primary}>Tinjau Pendaftaran <Asset name="registration/submit-arrow.svg" width={14} height={14} /></button>
      </form>}
      {step === 2 && <section className={styles.review} aria-label="Ringkasan pendaftaran"><h2>Ringkasan pilihan & data</h2><dl>{[["Layanan", service?.title], ["Paket", selectedPackage?.name], ["Biaya", packagePriceLabel], ["Preferensi tanggal", formatDate(data.date)], ["Preferensi waktu", `${data.time} WIB`], ["Orang tua / wali", data.guardian], ["Pasien", data.patient], ["Usia", `${data.age} tahun`], ["WhatsApp", data.whatsapp]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={styles.notice}><h3>Belum dikirim ke klinik</h3><p>Seluruh data di atas, termasuk identitas pasien anak, akan diteruskan ke admin SAGARA melalui WhatsApp setelah Anda menyetujui. Pesan pra-isi berada di parameter tautan WhatsApp. Anda tetap perlu menekan Kirim di WhatsApp. Jadwal dan biaya baru berlaku setelah dikonfirmasi admin.</p></div><details><summary>Tinjau pesan WhatsApp lengkap</summary><pre className={styles.message}>{message}</pre></details><div className={styles.consent}><label><input type="checkbox" checked={shareConsent} onChange={event => setShareConsent(event.target.checked)} /><span>Saya menyetujui pembagian seluruh data pendaftaran di atas, termasuk nama dan usia pasien anak serta nomor WhatsApp wali, kepada admin SAGARA melalui WhatsApp.</span></label></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => { setShareConsent(false); moveTo(1); }}>Kembali & perbaiki</button>{href ? <a className={styles.primary} href={href} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" onClick={openWhatsApp}>Kirim Pendaftaran via WhatsApp <span aria-hidden="true">↗</span></a> : shareConsent ? <p role="alert">WhatsApp admin belum dikonfigurasi. Permintaan belum dikirim.</p> : <button type="button" className={styles.primary} disabled>Kirim Pendaftaran via WhatsApp</button>}</div></section>}
      {step === 3 && <section className={styles.review} aria-label="Langkah berikutnya"><span className={styles.status}>Menunggu tindakan & konfirmasi admin</span><h2>Silakan kirim pesan di WhatsApp.</h2><p>Jika WhatsApp tidak terbuka, gunakan tombol di bawah. Tidak ada pendaftaran yang dikirim otomatis. Admin akan mengonfirmasi ketersediaan jadwal, rincian biaya, dan langkah berikutnya.</p><div className={styles.actions}>{href && <a href={href} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className={styles.secondary} onClick={openWhatsApp}>Buka WhatsApp kembali ↗</a>}<Link href="/" className={styles.primary}>Kembali ke Beranda</Link></div><button type="button" className={styles.textButton} onClick={() => moveTo(2)}>Lihat ringkasan kembali</button></section>}
  </>;
}
