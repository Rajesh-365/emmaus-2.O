export type CouncilSeed = {
  name: string;
  role: string;
  phone: string;
  whatsapp?: string;
  image?: string;
};

export const council: CouncilSeed[] = [
  {
    name: "K. Mohan Prabhakar",
    role: "Founder & Correspondent",
    phone: "+91 9701936669",
    whatsapp: "+91 7981724802",
    image: "/images/council/mohan.png",
  },
  {
    name: "Rev. Venu Babu",
    role: "Dean of Studies",
    phone: "+91 9908663276",
    image: "/images/council/venu.png",
  },
  {
    name: "Rev. Abraham",
    role: "Admissions In-Charge",
    phone: "+91 86862 84462",
    image: "/images/council/abraham.png",
  },
  {
    name: "Rev. Ananiah",
    role: "Examination Co-ordinator",
    phone: "+91 98483 82149",
    image: "/images/council/ananiah.png",
  },
];
