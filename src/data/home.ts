import { consultationContent } from "./service-content";

export const methods = [
  {
    title: "Tekhno Klamp / Smart Klamp",
    badge: "Terpopuler Anak",
    icon: "imgContainer.svg",
    description: "Tabung pelindung sekali pakai (disposable). Perlindungan optimal dari gesekan pampers & celana.",
    bullets: ["Anti air, bisa mandi langsung", "Tanpa perban atau jahitan", "Usia: 0 Bulan - 12 Tahun"],
    action: "Tanya Metode Klamp",
  },
  {
    title: "Bius Comfort-In (Needle Free)",
    badge: "Pilihan Pembiusan",
    icon: "imgContainer2.svg",
    description: "Menembakkan cairan anestesi berkecepatan tinggi melalui pori-pori kulit secara instan dan tanpa jarum.",
    bullets: ["Hilangkan phobia suntikan", "Reaksi kebas cepat (hitungan detik)", "Dapat dikombinasi ke semua metode"],
    action: "Tanya Pilihan Pembiusan",
  },
  {
    title: "Laser / Flash Cauter Medis",
    badge: "Minim Perdarahan",
    icon: "cauter.svg",
    description: "Menggunakan generator panas mikro presisi untuk memotong sekaligus menutup pembuluh darah kecil.",
    bullets: ["Tindakan cepat (10–15 menit)", "Cocok anak usia SD hingga Remaja", "Hemat & efisien biaya"],
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
  { title: "Pilihan hadiah", description: "Konfirmasikan pilihan dan ketersediaan kepada admin.", icon: "imgGift.svg" },
  { title: "Informasi obat", description: "Jenis, durasi, dan penggunaan mengikuti arahan tenaga medis.", icon: "imgPill.svg" },
  { title: "Konsultasi lanjutan", description: "Tanyakan ketentuan dan biaya konsultasi lanjutan.", icon: "imgMessagesSquare.svg" },
  { title: "Informasi kontrol", description: "Konfirmasikan jadwal, ketentuan, dan biaya kontrol.", icon: "imgStethoscope.svg" },
  { title: "Celana khitan", description: "Tanyakan ketersediaan dan ketentuan paket.", icon: "imgShirt.svg" },
] as const;

export const faqs = [
  { question: "Metode mana yang cocok untuk saya atau anak saya?", answer: "Pilihan metode mengikuti konsultasi dan penilaian kondisi pasien. Tanyakan manfaat, risiko, pembiusan, serta perawatan setiap pilihan sebelum memutuskan." },
  { question: "Apakah bius tanpa jarum cocok untuk semua pasien?", answer: "Tidak selalu. Free Needle Injection adalah pilihan pembiusan yang perlu dinilai kesesuaiannya saat konsultasi. Respons setiap pasien dapat berbeda." },
  { question: "Berapa biaya khitan di SAGARA?", answer: "Hubungi admin untuk menanyakan biaya sesuai kebutuhan dan layanan yang dipilih. Rincian biaya dikonfirmasi sebelum jadwal disepakati." },
  { question: "Apakah bisa khitan di rumah?", answer: "SAGARA menyediakan pilihan homecare. Area layanan, kesiapan tempat, jadwal, dan kelayakan pasien perlu dikonfirmasi terlebih dahulu." },
  { question: "Bagaimana perawatan setelah khitan?", answer: consultationContent.aftercare },
  { question: "Apa yang perlu disiapkan sebelum kunjungan?", answer: consultationContent.preparation },
  { question: "Apakah mengisi formulir langsung memastikan jadwal?", answer: consultationContent.registration },
] as const;
