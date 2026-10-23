export type KhitanPackage = Readonly<{
  id: string;
  name: string;
  price: null;
  priceStatus: "pending-business-verification";
  features: readonly string[];
  tone: "blue" | "gold";
  actionLabel: string;
  message: string;
}>;

export const packages: readonly KhitanPackage[] = [
  {
    id: "modern",
    name: "Paket Modern",
    price: null,
    priceStatus: "pending-business-verification",
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
    price: null,
    priceStatus: "pending-business-verification",
    features: [
      "Metode Top Sealer",
      "Pembiusan dikonfirmasi saat konsultasi",
    ],
    tone: "gold",
    actionLabel: "Tanya paket Top Sealer",
    message: "Halo admin Sagara, saya ingin menanyakan rincian paket Top Sealer.",
  },
];

export const packagePriceLabel = "Hubungi admin untuk biaya";

export const packageCaveat =
  "Harga belum dikonfirmasi. Hubungi admin untuk biaya, rincian fasilitas, pengecualian, serta kemungkinan biaya tambahan sebelum menentukan pilihan.";
