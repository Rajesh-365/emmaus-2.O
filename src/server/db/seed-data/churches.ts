export type ChurchSeed = {
  name: string;
  location: string;
  pastor: string;
  phone: string;
  status: "active" | "construction";
  image?: string;
};

export const churches: ChurchSeed[] = [
  {
    name: "JGF Church, Boppudi",
    location: "Chilakaluripet, Palnadu District",
    pastor: "Rev. Abraham",
    phone: "+91 86862 84462",
    status: "active",
    image: "/images/churches/boppudi.png",
  },
  {
    name: "JGF Church, Sirigiripadu",
    location: "Veldurthi Mandal, Palnadu District",
    pastor: "Lella Joshua (Venkateswarlu)",
    phone: "+91 99512 43829",
    status: "active",
    image: "/images/churches/sirigiripadu.jpeg",
  },
  {
    name: "Kunkuduchettupenta Thanda",
    location: "Nallamalla Forest",
    pastor: "Mariyadasu",
    phone: "+91 77026 84554",
    status: "construction",
    image: "/images/churches/nallamalla.jpeg",
  },
];
