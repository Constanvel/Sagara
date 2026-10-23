import Link from "next/link";
import { ContactAction } from "@/components/ui/ContactAction";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Kebijakan Privasi",
  "Penjelasan penanganan teknis data formulir, WhatsApp, penyimpanan browser, peta, dan media publik di situs SAGARA serta cara menghubungi admin terkait privasi.",
  "/kebijakan-privasi",
);

const heading = "text-xl font-extrabold leading-snug text-ink sm:text-2xl";
const section = "space-y-3 border-t border-line pt-6";

export default function KebijakanPrivasiPage() {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft px-6 py-8 sm:px-10 sm:py-12">
      <article className="mx-auto max-w-[800px] rounded-[20px] border border-line bg-white p-6 sm:p-10">
        <header>
          <p className="text-xs font-extrabold tracking-wider text-primary">INFORMASI PRIVASI SAGARA</p>
          <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-ink sm:text-5xl">Kebijakan Privasi</h1>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">Penjelasan tentang penanganan data yang terlihat pada implementasi situs saat ini, agar Anda dapat mempertimbangkan informasi yang ingin dibagikan.</p>
        </header>

        <aside aria-labelledby="privacy-review-status" className="mt-6 rounded-xl border border-line bg-soft p-5 text-sm leading-7 text-muted">
          <h2 id="privacy-review-status" className="font-extrabold text-ink">Ruang lingkup informasi privasi</h2>
          <p className="mt-2">Publikasi penjelasan ini telah disetujui pengelola. Halaman ini menjelaskan penanganan teknis saat ini, bukan sertifikasi kepatuhan hukum. Rincian penyimpanan, akses, dan penanganan data oleh admin belum dicantumkan. Tanyakan kepada admin sebelum membagikan data pribadi, terutama data anak atau informasi kesehatan.</p>
        </aside>

        <div className="mt-8 space-y-8 text-sm leading-7 text-muted sm:text-base">
          <section className={section} aria-labelledby="registration-data">
            <h2 id="registration-data" className={heading}>Data dalam formulir pendaftaran</h2>
            <p>Formulir meminta nama orang tua atau wali, nama pasien, usia pasien, nomor WhatsApp, pilihan layanan dan paket, serta preferensi tanggal dan waktu. Informasi ini digunakan untuk menyusun permintaan konsultasi dan preferensi jadwal, bukan untuk otomatis mengonfirmasi pendaftaran atau tindakan medis.</p>
            <p>Isian dikelola dalam memori halaman menggunakan state React. Implementasi formulir saat ini tidak mengirim isian ke basis data pendaftaran situs dan tidak menyimpan isian ke localStorage. Ini bukan jaminan bahwa seluruh data hanya ada selama tab terbuka: browser dapat mengelola autofill, pemulihan sesi, atau riwayatnya sendiri.</p>
          </section>

          <section className={section} aria-labelledby="whatsapp-sharing">
            <h2 id="whatsapp-sharing" className={heading}>Persetujuan dan pengiriman melalui WhatsApp</h2>
            <p>Anda dapat meninjau ringkasan dan pesan lengkap sebelum membagikan data. Tautan WhatsApp berisi data pendaftaran baru dibuat setelah Anda mencentang persetujuan berbagi yang terpisah pada langkah tinjauan. Mengubah isian atau kembali untuk memperbaiki data menghapus persetujuan berbagi tersebut sehingga Anda perlu menyetujuinya lagi. Persetujuan berbagi data ini bukan persetujuan tindakan medis (informed consent).</p>
            <p>Pesan lengkap, termasuk nama dan usia pasien, nama wali, nomor WhatsApp, pilihan layanan dan paket, serta preferensi jadwal, dimasukkan ke parameter URL WhatsApp. Membuka tautan membawa URL tersebut ke layanan WhatsApp; pesan tidak otomatis terkirim ke admin. Anda tetap perlu menekan Kirim di WhatsApp.</p>
            <p>WhatsApp memproses informasi menurut ketentuan dan kebijakan privasinya sendiri. URL dapat tercatat dalam riwayat browser atau diproses oleh aplikasi dan layanan pihak ketiga. Setelah dikirim, data juga berada dalam percakapan dengan admin; penanganannya tidak dikendalikan oleh state formulir situs.</p>
          </section>

          <section className={section} aria-labelledby="browser-hosting">
            <h2 id="browser-hosting" className={heading}>Browser, hosting, dan penyimpanan lokal</h2>
            <p>Kode situs menggunakan localStorage dengan kunci <code className="break-all rounded bg-soft px-1 py-0.5 text-sm text-ink">sagara_consultation_dismissed</code> hanya untuk mengingat bahwa notifikasi konsultasi telah ditutup, bukan untuk menyimpan data pendaftaran. Anda dapat menghapus preferensi ini melalui pengaturan penyimpanan situs pada browser.</p>
            <p>Browser dapat menyimpan riwayat, cache, atau autofill sesuai pengaturan Anda. Penyedia hosting juga dapat memproses data teknis permintaan, seperti alamat IP dan informasi browser, untuk menyajikan situs. Riwayat, autofill, serta praktik pencatatan dan penyimpanan penyedia hosting berada di luar kendali formulir; rinciannya belum diverifikasi dalam penjelasan ini.</p>
          </section>

          <section className={section} aria-labelledby="third-party-map">
            <h2 id="third-party-map" className={heading}>Peta dan layanan pihak ketiga</h2>
            <p>Halaman kontak menampilkan preview peta lokal. Peta interaktif Google Maps melalui iframe pihak ketiga baru dimuat setelah Anda menekan tombol muat peta. Saat peta interaktif dimuat, browser menghubungi Google sehingga Google dapat menerima data teknis koneksi dan memprosesnya menurut kebijakannya sendiri. Tautan petunjuk arah juga membuka layanan Google Maps. Pemrosesan oleh Google dan WhatsApp tidak diatur oleh penyimpanan formulir situs ini.</p>
          </section>

          <section className={section} aria-labelledby="public-media">
            <h2 id="public-media" className={heading}>Foto, video, dan dokumen yang terlihat</h2>
            <p>Foto dan video yang disajikan di situs merupakan media publik. Berkas asli yang belum disamarkan dapat diakses; identitas, wajah, atau dokumen yang tertangkap dalam media mungkin dapat terlihat atau terbaca. Tampilan kecil atau pemotongan gambar bukan perlindungan untuk isi berkas asli.</p>
            <p>Pengelola menyatakan publikasi media telah disetujui, termasuk izin orang tua atau wali untuk media anak. Dokumen izin tidak dipublikasikan dan belum diperiksa secara independen. Hubungi admin jika Anda keberatan atas publikasi atau ingin menarik izin penggunaan media.</p>
          </section>

          <section className={section} aria-labelledby="admin-practices">
            <h2 id="admin-practices" className={heading}>Penyimpanan dan akses oleh admin</h2>
            <p>Siapa saja yang dapat mengakses percakapan, berapa lama data disimpan, apakah ada salinan atau cadangan, dan bagaimana permintaan penghapusan ditangani oleh admin belum diverifikasi. Tidak ada jangka waktu penyimpanan tetap yang dinyatakan pada halaman ini. Tanyakan hal tersebut kepada admin sebelum mengirim data; bagikan hanya informasi yang diperlukan untuk konsultasi.</p>
          </section>

          <section className={section} aria-labelledby="privacy-requests">
            <h2 id="privacy-requests" className={heading}>Koreksi, penghapusan, dan penarikan media</h2>
            <p>Hubungi admin melalui kontak WhatsApp yang digunakan situs untuk meminta koreksi atau penghapusan data yang telah Anda kirim, serta penarikan foto atau video. Jelaskan permintaan dan sertakan rujukan seperlunya, misalnya tautan halaman atau media, tanpa mengirim ulang dokumen sensitif jika tidak diperlukan.</p>
            <p>Admin perlu mengonfirmasi cakupan dan tindak lanjut permintaan Anda. Penghapusan dari situs atau percakapan tidak menjamin hilangnya salinan yang sudah diunduh, dibagikan, dicadangkan, atau tersimpan dalam cache pihak lain.</p>
            <ContactAction message="Halo admin SAGARA, saya ingin menanyakan penanganan data pribadi atau mengajukan permintaan koreksi, penghapusan data, atau penarikan media. Mohon informasikan prosedurnya." className="mt-2 border border-primary bg-primary text-white">
              Hubungi admin tentang privasi
            </ContactAction>
            <p className="text-sm">Pesan awal ini tidak menyertakan isian formulir pendaftaran. Anda memilih sendiri informasi tambahan yang dikirim di WhatsApp.</p>
          </section>
        </div>

        <nav aria-label="Tautan terkait privasi" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-sm font-semibold text-primary">
          <Link href="/pendaftaran" className="inline-flex min-h-11 items-center underline underline-offset-4">Ke formulir pendaftaran</Link>
          <Link href="/kontak" className="inline-flex min-h-11 items-center underline underline-offset-4">Lokasi & kontak</Link>
        </nav>
      </article>
    </main>
  );
}
