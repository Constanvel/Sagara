import { expect, test } from "@playwright/test";
import { galleryMedia, heroSlides } from "../src/data/media";

const expectedCopy = [
  ["Setiap anak punya cerita beraninya.", "Kami hadir untuk menemani langkahnya."],
  ["Satu langkah besar menuju dewasa.", "Kami pastikan momen ini penuh tawa dan cerita indah."],
  ["Keberanian hari ini adalah kebanggaan esok hari.", "Terima kasih telah mempercayakan momen berharganya pada kami."],
  ["Di balik senyumnya, ada keberanian yang luar biasa.", "Kami bangga bisa menjadi bagian dari sejarah kecilnya."],
  ["Rasa takut berganti menjadi senyum kebanggaan.", "Kami di sini untuk membuat setiap prosesnya terasa mudah."],
  ["Setiap jagoan punya momen hebatnya masing-masing.", "Tugas kami adalah memastikan ia melewatinya dengan gembira."],
  ["Bukan sekadar tindakan, tapi pengalaman yang menyenangkan.", "Kami hadir dengan sepenuh hati untuk kenyamanan sang buah hati."],
  ["Mengubah rasa cemas menjadi senyum ceria.", "Sentuhan ramah kami selalu siap mendampingi setiap prosesnya."],
  ["Nyaman prosesnya, bahagia hasilnya.", "Kami ciptakan suasana terbaik agar jagoan kecil tetap tenang."],
  ["Senyum tenangnya adalah prioritas utama kami.", "Kami mendampingi dengan sabar, ramah, dan penuh kasih."],
  ["Pengalaman sunat yang seru dan bebas rasa takut.", "Kami hadir memberikan kenyamanan terbaik untuk jagoan Ayah dan Bunda."],
  ["Hari ini ia belajar arti keberanian yang sesungguhnya.", "Kami siap mengawal langkah awalnya menuju masa depan yang sehat."],
  ["Tumbuh sehat, tumbuh berani.", "Kami hadir mendukung langkah penting dalam perjalanan hidupnya."],
  ["Momen bersejarah bagi sang jagoan kecil.", "Kami mengabadikan keberaniannya dengan pelayanan yang tulus."],
  ["Langkah kecil hari ini untuk kesehatan masa depannya.", "Kami pastikan ia melewatinya dengan rasa aman dan nyaman."],
  ["Babak baru pertumbuhan jagoan kesayangan.", "Kami menemani setiap detiknya dengan pelayanan yang menenangkan."],
  ["Kebahagiaan Ayah dan Bunda dimulai dari senyumnya.", "Kami hadir memastikan jagoan kecil pulang dengan hati gembira."],
  ["Hadiah terbaik untuk keberanian yang hebat.", "Kami senang bisa melihatnya tersenyum bangga hari ini."],
  ["Tak ada yang lebih indah dari senyum leganya.", "Kami hadir sebagai sahabat terbaik di momen spesialnya."],
  ["Kepercayaan Ayah dan Bunda adalah amanah bagi kami.", "Kami berikan pengalaman paling berkesan untuk sang buah hati."]
];
const photoIndexes = [2, 0, 8, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

test("hero uses the exact 20 caption pairs without changing photo metadata or order", () => {
  expect(heroSlides.map(slide => [slide.heading, slide.description])).toEqual(expectedCopy);
  expect(heroSlides.map(({ heading, description, ...media }) => {
    expect(heading).toBeTruthy();
    expect(description).toBeTruthy();
    return media;
  })).toEqual(photoIndexes.map(index => galleryMedia[index]));
});

for (const width of [360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`all 20 captions fit readable, stable space at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
    const viewport = carousel.getByLabel("Geser foto jagoan");
    const caption = carousel.locator('div[aria-live="polite"]');
    const counter = carousel.locator('p[aria-live="polite"]');
    const originalCaption = await caption.boundingBox();
    const originalCarousel = await carousel.boundingBox();
    const originalCounter = await counter.boundingBox();
    expect(originalCaption).not.toBeNull();
    expect(originalCarousel).not.toBeNull();
    expect(originalCounter).not.toBeNull();

    for (let index = 0; index < expectedCopy.length; index++) {
      await viewport.evaluate((element, slideIndex) => {
        element.scrollTo({ left: element.clientWidth * slideIndex, behavior: "instant" });
      }, index);
      await expect(counter).toHaveText(`Foto ${index + 1} dari 20`);
      await expect(caption.locator("p")).toHaveText(expectedCopy[index]);
      await expect(carousel.getByRole("button", { name: `Tampilkan foto ${index + 1}`, exact: true })).toHaveAttribute("aria-pressed", "true");
      const bounds = await caption.boundingBox();
      const carouselBounds = await carousel.boundingBox();
      const counterBounds = await counter.boundingBox();
      expect(Math.abs(bounds!.height - originalCaption!.height)).toBeLessThanOrEqual(1);
      expect(Math.abs(bounds!.y - originalCaption!.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(carouselBounds!.height - originalCarousel!.height)).toBeLessThanOrEqual(1);
      expect(Math.abs(counterBounds!.y - originalCounter!.y)).toBeLessThanOrEqual(1);
      const textFits = await caption.evaluate(element => {
        const outer = element.getBoundingClientRect();
        return [...element.querySelectorAll("p")].every(paragraph => {
          const style = getComputedStyle(paragraph);
          const range = document.createRange();
          range.selectNodeContents(paragraph);
          const text = range.getBoundingClientRect();
          return parseFloat(style.fontSize) >= 14
            && style.webkitLineClamp === "none"
            && paragraph.scrollHeight <= paragraph.clientHeight + 1
            && text.left >= outer.left && text.right <= outer.right
            && text.top >= outer.top && text.bottom <= outer.bottom;
        });
      });
      expect(textFits, `caption ${index + 1} must fit without clipping or tiny text`).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}
