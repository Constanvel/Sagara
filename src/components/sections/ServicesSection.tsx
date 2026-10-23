import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section data-page-content aria-labelledby="catalog-heading" className="flow-root pb-7 md:pb-12">
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
      <aside aria-labelledby="service-help-heading" className="mt-[27px] min-h-[98px] rounded-[20px] bg-[#e5efff] px-[21px] pt-3 pb-1">
        <div className="flex items-center gap-3">
          <Asset name="service-message.svg" width={19} height={18} className="shrink-0" />
          <h2 id="service-help-heading" className="text-[16px] leading-[1.65] font-bold text-primary">Belum yakin memilih layanan?</h2>
        </div>
        <p className="mt-1 text-[13px] leading-[1.4] text-muted">Ceritakan kebutuhan keluarga kepada admin.</p>
        <ContactAction message="Halo admin Sagara, saya belum yakin memilih layanan khitan. Saya ingin menceritakan kebutuhan keluarga dan berkonsultasi." className="-my-[7px] !justify-start !gap-4 !rounded-none !px-0 !text-[13px] text-primary">
          Tanya admin Sagara
          <Asset name="service-arrow.svg" width={14} height={14} />
        </ContactAction>
      </aside>
      <section aria-labelledby="consultation-guide" className="mt-8 space-y-5 rounded-[20px] border border-line bg-white p-6 text-sm leading-7 text-muted md:p-8">
        <h2 id="consultation-guide" className="text-xl font-extrabold text-ink">Panduan konsultasi dan pendaftaran khitan</h2>
        <p>Panduan ini menjelaskan cara menggunakan layanan informasi dan formulir SAGARA, bukan petunjuk tindakan atau perawatan medis. Penilaian kondisi pasien dan arahan medis perlu dibahas langsung dengan tenaga medis.</p>
        <section aria-labelledby="guide-questions">
          <h3 id="guide-questions" className="font-extrabold text-ink">Pertanyaan sebelum menentukan pilihan</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Tanyakan siapa yang melakukan pemeriksaan dan tindakan, serta bagaimana keluarga dapat memverifikasi identitas dan kewenangannya.</li>
            <li>Bahas pilihan metode dan pembiusan, manfaat, risiko, alternatif, dan alasan kesesuaiannya untuk kondisi pasien. Nama metode saja tidak menentukan pilihan yang tepat.</li>
            <li>Minta rincian biaya, fasilitas yang termasuk, kemungkinan biaya tambahan, ketentuan kontrol, dan kontak tindak lanjut. Harga pada situs belum dikonfirmasi.</li>
            <li>Konfirmasikan alamat lengkap, jam layanan, dan ketersediaan jadwal sebelum berangkat. Untuk homecare, tanyakan jangkauan dan kesiapan tempat.</li>
          </ul>
        </section>
        <section aria-labelledby="guide-booking">
          <h3 id="guide-booking" className="font-extrabold text-ink">Cara mengajukan preferensi jadwal</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            <li>Pilih layanan dan paket yang ingin ditanyakan, lalu isi preferensi tanggal dan waktu dalam WIB serta data pendaftar.</li>
            <li>Tinjau ringkasan dan pesan lengkap. Isian tetap dapat diperbaiki sebelum Anda menyetujui pembagian data.</li>
            <li>Setelah persetujuan berbagi diberikan, buka WhatsApp dan tekan Kirim di aplikasi tersebut. Membuka tautan tidak otomatis mengirim pesan.</li>
            <li>Tunggu konfirmasi admin tentang jadwal, biaya, dan langkah berikutnya. Formulir ini bukan konfirmasi jadwal atau persetujuan tindakan medis.</li>
          </ol>
        </section>
        <section aria-labelledby="guide-privacy">
          <h3 id="guide-privacy" className="font-extrabold text-ink">Data dan batas informasi situs</h3>
          <p className="mt-2">Pesan WhatsApp dapat memuat identitas pasien anak dan wali. Bagikan hanya informasi yang diperlukan; tanyakan penanganan data kepada admin sebelum mengirim dokumen kesehatan. Jangan memakai formulir penjadwalan untuk mencari pertolongan darurat.</p>
          <p className="mt-2">Alamat jalan lengkap, jam operasional tetap, dan kredensial tenaga medis belum dicantumkan sebagai data terverifikasi di situs. Panduan ini tidak menyatakan adanya peninjauan medis atau menjamin hasil tindakan.</p>
        </section>
        <nav aria-label="Tautan panduan konsultasi" className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-primary">
          <Link href="/pendaftaran" className="inline-flex min-h-11 items-center underline underline-offset-4">Buka formulir pendaftaran</Link>
          <Link href="/kontak" className="inline-flex min-h-11 items-center underline underline-offset-4">Konfirmasi ke admin</Link>
          <Link href="/kebijakan-privasi" className="inline-flex min-h-11 items-center underline underline-offset-4">Baca kebijakan privasi</Link>
        </nav>
      </section>
    </section>
  );
}
