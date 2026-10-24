export type KhitanPackage = Readonly<{
  id: string;
  name: string;
  price: number;
  priceStatus: "reference-price";
  features: readonly string[];
  tone: "blue" | "gold";
  actionLabel: string;
  message: string;
}>;

export const packages: readonly KhitanPackage[] = [
  {
    id: "modern",
    name: "Paket Modern",
    price: 1100000,
    priceStatus: "reference-price",
    features: [
      "Metode modern (Tekhnoklamp)",
      "Pembiusan dikonfirmasi saat konsultasi",
    ],
    tone: "blue",
    actionLabel: "Tanya paket Modern",
    message: "Halo admin Sagara, saya ingin menanyakan rincian Paket Modern.",
  },
  {
    id: "top-sealer",
    name: "Paket Top Sealer",
    price: 900000,
    priceStatus: "reference-price",
    features: [
      "Metode Top Sealer",
      "Pembiusan dikonfirmasi saat konsultasi",
    ],
    tone: "gold",
    actionLabel: "Tanya paket Top Sealer",
    message: "Halo admin Sagara, saya ingin menanyakan rincian paket Top Sealer.",
  },
];

const priceFormatter = new Intl.NumberFormat("id-ID");

export function packagePriceLabel(item: Pick<KhitanPackage, "price">): string {
  return `Rp${priceFormatter.format(item.price)}`;
}

export const packageCaveat =
  "Harga mengikuti formulir Sagara yang diberikan. Rincian biaya dan fasilitas dikonfirmasi oleh admin.";
