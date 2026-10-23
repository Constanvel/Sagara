export const methods = [
  {
    title: "Tekhno Klamp / Smart Klamp",
    badge: "Pilihan Metode",
    icon: "imgContainer.svg",
    description: "Pilihan metode menggunakan tabung pelindung. Tanyakan kesesuaiannya berdasarkan usia dan kondisi pasien.",
    bullets: ["Konfirmasi aturan mandi dan aktivitas", "Bahas kebutuhan perban dan jahitan", "Kelayakan dinilai saat konsultasi"],
    action: "Tanya Metode Klamp",
  },
  {
    title: "Bius Comfort-In (Needle Free)",
    badge: "Pilihan Pembiusan",
    icon: "imgContainer2.svg",
    description: "Pilihan pembiusan tanpa jarum yang perlu dinilai kesesuaiannya oleh tenaga medis saat konsultasi.",
    bullets: ["Diskusikan kekhawatiran terhadap jarum", "Tanyakan manfaat dan risiko pembiusan", "Tidak selalu sesuai untuk semua pasien"],
    action: "Tanya Pilihan Pembiusan",
  },
  {
    title: "Laser / Flash Cauter Medis",
    badge: "Pilihan Metode",
    icon: "cauter.svg",
    description: "Menggunakan generator panas mikro presisi untuk memotong sekaligus menutup pembuluh darah kecil.",
    bullets: ["Durasi mengikuti kondisi dan tindakan", "Kesesuaian dinilai oleh tenaga medis", "Konfirmasi biaya dan perawatan"],
    action: "Tanya Metode Cauter",
  },
] as const;

export const needs = [
  { title: "Khitan anak-anak", description: "Dampingi jagoan memahami proses dan persiapannya.", icon: "imgSmile.svg" },
  { title: "Khitan bayi", description: "Bahas usia, kesiapan, dan kebutuhan perawatan bayi.", icon: "imgBaby.svg" },
  { title: "Khitan dewasa", description: "Konsultasi kebutuhan dan rencana perawatan Anda.", icon: "imgUserRound.svg" },
  { title: "Kebutuhan khusus", description: "Sampaikan kebutuhan pendampingan sejak awal.", icon: "imgHeartHandshake.svg" },
  { title: "Khitan gemuk", description: "Penilaian kondisi untuk memilih pendekatan yang sesuai.", icon: "imgAccessibility.svg" },
] as const;

export const benefits = [
  { title: "Sertifikat khitan", description: "Kenang-kenangan untuk jagoan.", icon: "imgAward.svg" },
  { title: "Hadiah langsung", description: "Mobil RC, bola, atau helikopter.", icon: "imgGift.svg" },
  { title: "Obat-obatan 3 hari", description: "Ikuti petunjuk penggunaan.", icon: "imgPill.svg" },
  { title: "Konsultasi sampai sembuh", description: "Gratis konsultasi lanjutan.", icon: "imgMessagesSquare.svg" },
  { title: "Kontrol Gratis", description: "Pantau kondisi setelah khitan.", icon: "imgStethoscope.svg" },
  { title: "Celana khitan", description: "Gratis satu celana khitan", icon: "imgShirt.svg" },
] as const;

export const faqs = [
  { question: "Metode mana yang cocok untuk saya atau anak saya?", answer: "Pilihan metode mengikuti konsultasi dan penilaian kondisi pasien. Tanyakan manfaat, risiko, pembiusan, serta perawatan setiap pilihan sebelum memutuskan." },
  { question: "Apakah bius tanpa jarum cocok untuk semua pasien?", answer: "Tidak selalu. Free Needle Injection adalah pilihan pembiusan yang perlu dinilai kesesuaiannya saat konsultasi. Respons setiap pasien dapat berbeda." },
  { question: "Berapa biaya khitan di SAGARA?", answer: "Hubungi admin untuk menanyakan biaya sesuai kebutuhan dan layanan yang dipilih. Rincian biaya dikonfirmasi sebelum jadwal disepakati." },
  { question: "Apakah bisa khitan di rumah?", answer: "SAGARA menyediakan pilihan homecare. Area layanan, kesiapan tempat, jadwal, dan kelayakan pasien perlu dikonfirmasi terlebih dahulu." },
  { question: "Bagaimana perawatan setelah khitan?", answer: "Ikuti petunjuk perawatan, penggunaan obat, mandi, dan aktivitas yang diberikan tenaga medis. Konfirmasikan jadwal kontrol serta ketentuan konsultasi lanjutan. Bila ada keluhan, hubungi layanan untuk arahan; kondisi darurat memerlukan pertolongan medis segera." },
  { question: "Apa yang perlu disiapkan sebelum kunjungan?", answer: "Konfirmasikan jadwal dan lokasi kepada admin. Sampaikan riwayat kesehatan, alergi, obat yang digunakan, serta kebutuhan pendampingan kepada tenaga medis. Tanyakan instruksi persiapan yang sesuai; jangan mengubah obat atau berpuasa tanpa arahan tenaga medis." },
  { question: "Apakah mengisi formulir langsung memastikan jadwal?", answer: "Belum. Pilih layanan dan jadwal yang diinginkan pada formulir pendaftaran, lalu kirim rincian melalui WhatsApp setelah menyetujui berbagi data. Jadwal, biaya, dan kesiapan layanan tetap perlu dikonfirmasi oleh admin." },
] as const;
