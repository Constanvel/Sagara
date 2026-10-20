export type KhitanPackage = {
  id: string;
  name: string;
  price: number;
  features: readonly string[];
  tone: "blue" | "gold";
  actionLabel: string;
  message: string;
};

export const packages: readonly KhitanPackage[] = [
  {
    id: "modern",
    name: "Paket Modern",
    price: 1100000,
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
    name: "Top Sealer",
    price: 900000,
    features: [
      "Metode Top Sealer",
      "Pembiusan dikonfirmasi saat konsultasi",
    ],
    tone: "gold",
    actionLabel: "Tanya paket Top Sealer",
    message: "Halo admin Sagara, saya ingin menanyakan rincian paket Top Sealer.",
  },
];

export const packageCaveat =
  "Harga mengikuti formulir Sagara yang diberikan. Rincian biaya dan fasilitas dikonfirmasi oleh admin.";
