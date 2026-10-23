# SAGARA

Website informasi dan pendaftaran khitan melalui WhatsApp. Dibangun dengan Next.js App Router, React, dan TypeScript. Tidak ada database pendaftaran atau konfirmasi jadwal otomatis.

## Pengembangan

Gunakan Node.js 24 dan npm, lalu jalankan:

```sh
npm ci
npm run dev
```

Halaman: `/`, `/layanan`, `/paket`, `/galeri`, `/kontak`, `/pendaftaran`.

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

## Keamanan dan privasi

- [Header keamanan](docs/security-hardening.md).
- [Keputusan publikasi media dan checklist rilis](docs/media-privacy-remediation.md).
- Redaksi gambar dibatalkan atas permintaan pemilik; gambar asli ditampilkan, termasuk dokumen yang mungkin memuat identitas. Persetujuan wali disimpan privat, bukan di repository.
- Pesan pendaftaran memuat identitas setelah persetujuan berbagi. Jangan mencatat pesan atau URL WhatsApp pada log/analytics.
- Dokumen audit dan implementasi lama di `docs/` adalah catatan historis; keterangan jumlah halaman, galeri, dan deployment di sana dapat menggambarkan versi sebelumnya.
