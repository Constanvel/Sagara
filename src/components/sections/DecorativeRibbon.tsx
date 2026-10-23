import Image from "next/image";
import styles from "./HeroSection.module.css";

export function DecorativeRibbon() {
  return <div aria-hidden="true" className={`pointer-events-none relative w-full overflow-hidden lg:hidden ${styles.ribbon}`}>
    <Image src="/images/figma/hero-ribbon.png" alt="" width={412} height={31} unoptimized className="block h-auto w-full" />
  </div>;
}
