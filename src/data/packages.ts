export type KhitanPackage = Readonly<{
  id: string;
  name: string;
  price: number | null;
  priceStatus: "reference-price" | "confirmation-required";
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
    name: "Paket Top Seller",
    price: 900000,
    priceStatus: "reference-price",
    features: [
      "Metode Top Seller",
      "Pembiusan dikonfirmasi saat konsultasi",
    ],
    tone: "gold",
    actionLabel: "Tanya paket Top Seller",
    message: "Halo admin Sagara, saya ingin menanyakan rincian paket Top Seller.",
  },
];

// Service-specific prices confirmed by the owner. Other services keep the original prices.
const servicePrices: Readonly<Record<string, Readonly<Record<string, number | null>>>> = {
  dewasa: { modern: 2500000, "top-sealer": 1750000 },
  "kebutuhan-khusus": { modern: 2000000, "top-sealer": 1500000 },
};

export function packageForService(item: KhitanPackage, serviceId: string): KhitanPackage {
  const prices = servicePrices[serviceId];
  if (!prices || !(item.id in prices)) return item;
  const price = prices[item.id];
  return { ...item, price, priceStatus: price === null ? "confirmation-required" : "reference-price" };
}

const priceFormatter = new Intl.NumberFormat("id-ID");

export function packagePriceLabel(item: Pick<KhitanPackage, "price">): string {
  return item.price === null ? "Konfirmasi admin" : `Rp${priceFormatter.format(item.price)}`;
}

export const packageCaveat =
  "Harga mengikuti formulir Sagara yang diberikan. Rincian biaya dan fasilitas dikonfirmasi oleh admin.";
