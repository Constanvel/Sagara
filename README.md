# SAGARA

Website informasi dan pendaftaran khitan melalui WhatsApp. Dibangun dengan Next.js App Router, React, dan TypeScript. Tidak ada database pendaftaran atau konfirmasi jadwal otomatis.

## Pengembangan

Gunakan Node.js 24 dan npm, lalu jalankan:

```sh
npm ci
npm run dev
```

Halaman: `/`, `/layanan`, `/paket`, `/galeri`, `/kontak`, `/pendaftaran`, `/kebijakan-privasi`.

## Validasi

```sh
npm run lint
npx --no-install next typegen
npm run typecheck
npm run build
npx --no-install playwright install chromium
npx --no-install playwright test
```

Playwright memakai server development secara lokal. Pada CI, build dilakukan terlebih dahulu dan tes memakai `next start`. Untuk pengujian produksi lokal di PowerShell setelah build:

```powershell
$env:CI = "true"
npx --no-install playwright test
Remove-Item Env:CI
```

GitHub Actions juga memeriksa dependency dan secret dengan keluaran tersamarkan. Jangan mengunggah screenshot, trace, atau video pengujian yang memuat pasien ke artefak publik.

## SEO dan pencarian lokal

Beranda menargetkan pencarian brand SAGARA dengan sinonim khitan/sunat dan lokasi Banteran, Sumbang. Halaman layanan, paket, dan kontak memiliki heading berbeda. Tidak ada jaminan peringkat pertama; metadata dan schema bukan bukti indeks atau ranking.

### Langkah pemilik setelah deployment

1. Verifikasi properti `https://sagara-vert.vercel.app` di Google Search Console, periksa URL beranda dan canonical pilihan Google, lalu kirim `/sitemap.xml`. Periksa juga tindakan manual dan masalah keamanan. Gunakan Bing Webmaster Tools untuk mesin pencari lain.
2. Klaim/verifikasi Google Profil Bisnis yang sudah ada, tanpa membuat listing duplikat. Gunakan nama bisnis nyata dan kategori yang sesuai; tautkan website serta halaman pendaftaran.
3. Konfirmasi alamat lengkap, kode pos, jam layanan, cakupan homecare, profil sosial resmi, kredensial, serta rincian paket. Perbarui `src/data/contact.ts` dan schema hanya dari fakta terverifikasi. Jangan menebak dari koordinat atau menambahkan rating buatan.
4. Tinjau informasi medis bersama tenaga medis. Klaim universal tentang hasil, waktu mandi, pembiusan, dan durasi tidak digunakan sebagai janji. FAQ menjelaskan persiapan kunjungan, batas perawatan umum, dan konfirmasi jadwal; informasi ini bukan penilaian klinis individual. Identitas/kredensial peninjau hanya ditambahkan setelah verifikasi. Dua kartu kebutuhan khusus tetap dipertahankan sampai maksud layanannya dikonfirmasi, tanpa mengarang layanan baru.
5. Minta ulasan jujur tanpa imbalan atau penyaringan pelanggan. Balas tanpa membuka informasi pasien. Utamakan penyebutan/tautan lokal yang sah, bukan backlink massal.
6. Catat baseline dan evaluasi tiap 28 hari: indeks, impression, klik, CTR, posisi rata-rata keyword brand, halaman tujuan, perangkat, dan tindakan Profil Bisnis. Jangan mengirim identitas atau isi formulir pasien ke analytics.

### Jika domain resmi berubah

Domain sendiri membantu identitas jangka panjang, bukan jaminan ranking. Setelah kepemilikan/DNS dikonfirmasi, ubah `siteUrl` di `src/lib/seo.ts` dan origin pada tes SEO; `metadataBase`, canonical, social URL, sitemap, robots, dan schema mengikuti sumber yang sama. Konfigurasikan redirect permanen host produksi lama ke domain utama dengan path tetap, cegah indexing deployment preview, dan perbarui Search Console serta tautan profil resmi. Jangan mengubah host sebelum domain siap.

Alamat lengkap, jam, akun sosial, kredensial, domain baru, akses Search Console/Profil Bisnis, serta review medis belum diverifikasi oleh perubahan kode ini. Tidak ada halaman duplikat khusus tiap variasi keyword, database baru, atau analytics pasien.

## SEO lanjutan: status dan batas rilis

- Nomor WhatsApp resmi, label, CTA, dan schema menggunakan `src/data/contact.ts`. `NEXT_PUBLIC_WHATSAPP_NUMBER` tidak lagi mengganti tujuan; hapus konfigurasi lama di hosting setelah memeriksa nomor resmi. Mengubah nomor memerlukan pembaruan data, tes, dan deployment.
- `/kebijakan-privasi` menjelaskan perilaku teknis saat ini dan keterbatasan informasi operasional. Publikasi penjelasan telah disetujui pengelola; rincian retensi, pihak yang mengakses pesan admin, serta prosedur penghapusan belum diberikan dan tidak dikarang. Persetujuan publikasi bukan verifikasi independen atau sertifikasi kepatuhan hukum.
- Build dengan `VERCEL_ENV=preview` mengirim `X-Robots-Tag: noindex`; produksi/development tidak. Verifikasi pada host sesungguhnya setelah deployment. Header tidak membatasi akses: aktifkan Vercel Deployment Protection secara terpisah. Jangan menonaktifkan crawling produksi atau memakai robots disallow sebagai satu-satunya pencegah indeks.
- Domain tetap saat ini. Tidak ada alamat/jam, harga, klasifikasi medis, profil resmi, atau kredensial baru yang dikarang. Pemilik telah mengonfirmasi kartu kebutuhan khusus terakhir sebagai Khitan Gemuk (`khitan-gemuk`), terpisah dari Khitan Kebutuhan Khusus. Harga Khitan Gemuk belum diberikan dan ditampilkan sebagai “Konfirmasi admin”. Revisi harga 25 Oktober 2026: Khitan Dewasa Modern Rp2.500.000 / Top Seller Rp1.750.000; Khitan Kebutuhan Khusus Modern Rp2.000.000 / Top Seller Rp1.500.000. Harga Khitan anak-anak dan Khitan bayi tetap Modern Rp1.100.000 / Top Seller Rp900.000. Waktu diisi mandiri dalam format 24 jam HH:mm WIB, kosong secara default; jadwal tetap memerlukan konfirmasi admin. Kartu, formulir, ringkasan, dan pesan memakai sumber harga yang sama; biaya akhir dan fasilitas tetap dikonfirmasi admin.
- Tidak ada analytics baru, session replay, form autocapture, database, atau perubahan media. Formulir tetap perlu persetujuan terpisah dan tindakan pengguna di WhatsApp.

### Antrean yang membutuhkan akses/fakta pemilik

1. Search Console/Bing: verifikasi kepemilikan, URL Inspection, canonical pilihan mesin pencari, sitemap, keamanan/tindakan manual, serta baseline 28 hari. Undang akun; jangan simpan kredensial dalam Git.
2. Google Profil Bisnis: listing yang sudah ada, kategori/nama nyata, NAP/jam cocok, foto fasilitas berizin, ulasan jujur tanpa hadiah atau penyaringan. Jangan membuka informasi pasien saat membalas.
3. Alamat/kode pos/jam/homecare/profil resmi: konfirmasi sebelum menambah schema atau mengganti ketidakpastian pada halaman kontak.
4. Tenaga medis: verifikasi istilah metode (khususnya laser/cautery), manfaat/risiko, fasilitas, serta izin menampilkan nama/peran/kredensial; baru buat halaman profil atau edukasi yang substansial beserta peninjau dan tanggal sebenarnya.
5. Paket: konfirmasi angka, fasilitas, pengecualian/biaya tambahan, masa berlaku. Angka referensi Figma dipulihkan atas permintaan pemilik; publikasi referensi tidak menggantikan konfirmasi biaya akhir oleh admin.
6. Performa: ukur deployment/commit yang sama pada tujuh route, mobile/desktop, minimal tiga pengukuran dengan kondisi tetap. Catat LCP element, transfer, font/JS, cache dan variasi; periksa interaksi formulir/galeri/navigasi. Sasaran data lapangan p75 LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1. Lab bukan bukti CrUX; optimalkan hanya bottleneck yang terukur. Jangan unggah capture pasien.
7. Domain sendiri: konfirmasi kepemilikan/DNS/TLS dahulu, lalu jalankan prosedur migrasi di atas. Jangan membuat redirect host preview/localhost ke produksi.

### Baseline performa produksi — 23 Oktober 2026

Target `https://sagara-vert.vercel.app`, commit publik yang dilaporkan `b7b392c` (revision deployment tidak diverifikasi secara independen). Ini **bukan** pengukuran perubahan lokal ini. Semua 36 navigasi HTTP 200, tanpa kegagalan request atau exception halaman yang teramati.

Protokol: headless Chromium 156.0.8078.4 / Playwright 1.64.1, tiga pengulangan per halaman/perangkat, konteks baru, cache browser nonaktif, service worker diblokir, DPR 1. Mobile 390×844 dan desktop 1440×900; keduanya CPU 4×, latensi 150 ms, unduh 1,6 Mbps, unggah 750 Kbps melalui CDP page target. Jendela observasi delapan detik, tanpa interaksi atau isian. Target iframe lintas origin mungkin tidak mewarisi throttle; request belum selesai dikecualikan dari transfer. Hasil dipengaruhi jaringan/server dan tidak mengukur INP atau p75 CrUX.

| Halaman | LCP mobile median [min–maks], detik | LCP desktop median [min–maks], detik | CLS median mobile/desktop | Transfer median mobile/desktop, KiB |
|---|---|---|---|---|
| `/` | 2,140 [2,100–2,472] | 2,680 [2,552–2,964] | 0,066 / 0,010 | 373 / 427 |
| `/layanan` | 1,884 [1,608–1,996] | 1,640 [1,584–1,732] | 0,066 / 0,010 | 299 / 296 |
| `/paket` | 1,736 [1,344–1,776] | 1,972 [1,696–1,980] | 0,066 / 0,010 | 293 / 289 |
| `/galeri` | 2,268 [2,124–2,976] | 2,288 [2,032–2,944] | 0,066 / 0,010 | 388 / 762 |
| `/kontak` | 1,804 [1,592–1,876] | 1,444 [1,420–1,560] | 0,066 / 0,010 | 768 / 793 |
| `/pendaftaran` | 3,584 [3,268–4,496] | 3,572 [2,796–4,628] | 0,066 / 0,010 | 283 / 279 |

Prioritas investigasi, bukan diagnosis: formulir memiliki LCP heading terlambat meski payload rendah; beranda desktop memiliki LCP gambar; transfer gambar galeri desktop sekitar 521 KiB; kontak memuat sekitar 608 KiB JS termasuk peta dan masih memiliki request tertunda pada 4/6 run. Periksa timeline render/hydration/font dan resource dependency sebelum mengubah loading, animasi, atau Maps. Tidak ada optimasi spekulatif, perubahan media, telemetry, atau session replay pada fase ini. Tidak ada data lapangan CrUX yang diverifikasi. Halaman privasi belum ada pada deployment baseline dan perlu diukur setelah rilis.

Artefak agregat disimpan privat di direktori sementara yang disetujui, bukan Git. Tidak ada screenshot, trace, video, body respons, atau identitas pasien yang direkam oleh pengukuran ini.

### Gerbang persetujuan pemilik

Pengelola menyetujui publikasi perubahan dan menyatakan seluruh persetujuan telah diberikan. Persetujuan awal tersebut tidak memasok alamat, jam, angka harga, identitas medis, atau rincian operasional baru. Pada 24 Oktober 2026, pemilik meminta harga referensi pada Figma asli ditampilkan kembali; rincian biaya akhir tetap memerlukan konfirmasi admin. Pemilik perlu mengisi tabel berikut dalam dokumen privat; hanya fakta yang memang boleh dipublikasikan yang kemudian dipindahkan ke sumber data situs. Jangan memasukkan bukti identitas pasien, chat, kredensial, atau dokumen izin mentah ke Git.

| Kelompok | Fakta yang harus disetujui | Penanggung jawab/tanggal | Status |
|---|---|---|---|
| Identitas lokal | Nama nyata, alamat lengkap/kode pos, titik Maps, klasifikasi usaha, profil resmi | Belum diberikan | Menunggu |
| Operasional | Jam/reservasi/hari libur, cakupan homecare dan biaya perjalanan | Belum diberikan | Menunggu |
| Paket | Harga berlaku, fasilitas, pengecualian, tambahan biaya, kontrol | Referensi Figma diminta kembali oleh pemilik, 24 Oktober 2026 | Harga referensi tampil; rincian akhir dikonfirmasi admin |
| Layanan | Kartu kebutuhan khusus terakhir adalah Khitan Gemuk, terpisah dari Khitan Kebutuhan Khusus | Dikonfirmasi pemilik, 25 Oktober 2026 | ID kanonis `khitan-gemuk`; harga belum diberikan: Konfirmasi admin |
| Klinis | Istilah laser/cautery, kelayakan pembiusan/metode, durasi, mandi/aktivitas, obat/kontrol, fasilitas | Tenaga medis belum ditetapkan | Belum ditinjau medis |
| Profil medis | Nama/peran/kualifikasi/hubungan dengan SAGARA, izin publikasi, tanggung jawab review | Belum diberikan | Halaman belum dibuat |
| Privasi | Identitas pengelola, akses admin, retensi/cadangan, proses koreksi/penghapusan/penarikan media | Belum diberikan | Penjelasan teknis, bukan kebijakan final |
| Akses | Search Console, Bing, Profil Bisnis, Vercel; DNS hanya bila domain dipilih | Belum diberikan | Tidak dapat memverifikasi layanan privat |

Peninjauan klinis tidak dilakukan oleh tes otomatis. Jangan mencantumkan nama peninjau atau tanggal pemeriksaan yang belum terjadi. Jangan membuat halaman profil/edukasi kosong untuk mengejar keyword.

Evaluasi setiap 28 hari: indeks halaman prioritas, brand/nonbrand queries, impression, klik, CTR, posisi rata-rata, halaman tujuan, perangkat/negara dan tindakan Profil Bisnis. Pisahkan kata ambigu “sagara”. Klik WhatsApp bukan bukti pendaftaran selesai; tidak ada janji peringkat pertama.

## Keamanan dan privasi

- [Header keamanan](docs/security-hardening.md).
- [Keputusan publikasi media dan checklist rilis](docs/media-privacy-remediation.md).
- Redaksi gambar dibatalkan atas permintaan pemilik; gambar asli ditampilkan, termasuk dokumen yang mungkin memuat identitas. Persetujuan wali disimpan privat, bukan di repository.
- Pesan pendaftaran memuat identitas setelah persetujuan berbagi. Jangan mencatat pesan atau URL WhatsApp pada log/analytics.
- Dokumen audit dan implementasi lama di `docs/` adalah catatan historis; keterangan jumlah halaman, galeri, dan deployment di sana dapat menggambarkan versi sebelumnya.
