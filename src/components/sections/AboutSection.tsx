import Image from "next/image";
import { DecorativeRibbon } from "./HeroSection";
import styles from "./AboutSection.module.css";
import { AboutVideo } from "./AboutVideo";

export function AboutSection() {
  return <section id="tentang-sagara" aria-labelledby="about-title" className={styles.section}>
    <div className={styles.container} data-reveal-group>
      <header data-reveal>
        <p className={styles.label}><span aria-hidden="true" />TENTANG KAMI</p>
        <h2 id="about-title" className={styles.title}><span>Sagara Rumah</span><br />Sunat Modern.</h2>
      </header>
      <div className={styles.content}>
        <div data-reveal className={styles.media}><AboutVideo /></div>
        <div className={styles.description} data-reveal-group>
          <div data-reveal>
            <h3>Sagara Rumah Sunat Modern</h3>
            <p>hadir di Bantern, Sumbang, untuk membantu keluarga merencanakan layanan khitan bagi anak maupun dewasa. Setiap pasien membawa kebutuhan,kesiapan, dan pertanyaan yang berbeda.</p>
            <p>Melalui konsultasi, Anda dapat membahas pilihan layanan, pembiusan, persiapan, serta perawatan setelah tindakan. Kesesuaian tindakan dan rincian biaya dikonfirmasi sebelum jadwal disepakati.</p>
          </div>
          <aside className={styles.card} data-reveal>
            <Image src="/images/figma/about-chat.svg" alt="" width={25} height={24} />
            <div><p>Boleh mulai dari bertanya</p><p>Tidak perlu menemukan semuanya sendiri</p></div>
          </aside>
        </div>
      </div>
    </div>
    <DecorativeRibbon />
  </section>;
}
