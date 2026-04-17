/** Single source of truth for site-wide metadata. */
export const site = {
  name: "Emmaus Institute of Theology",
  shortName: "Emmaus Institute",
  tagline: "The Gospel that brings more than hope. It brings a new Beginning.",
  description:
    "Emmaus Institute of Theology equips disciples for ministry through rigorous theological education, serving 500+ unreached communities across Andhra Pradesh, Telangana, and Odisha since 2018.",
  url: "https://www.emmausinst.com",
  locale: "en_IN",
  contact: {
    name: "K. Mohan Prabhakar",
    role: "Admissions In-Charge",
    whatsapp: "+91 79817 24802",
    whatsappDigits: "917981724802",
    phone: "+91 97019 36669",
    phoneDigits: "919701936669",
    email: "eit.jgf2018@gmail.com",
    address: "Guntur, Andhra Pradesh, India",
    mapUrl: "https://maps.app.goo.gl/EudEDYsEDYyzoMAM7",
  },
  social: {
    whatsapp:
      "https://api.whatsapp.com/send?phone=917981724802&text=Hello%20Emmaus%20Institute%2C%20I%27d%20like%20to%20know%20more%20about%20admissions.",
    email: "mailto:eit.jgf2018@gmail.com",
    youtube: "https://youtube.com/@emmaustv-jgf",
    youtubeHandle: "@emmaustv-jgf",
    facebook: "https://www.facebook.com/profile.php?id=61578149010762",
    instagram: "https://www.instagram.com/emmausinstituteoftheology/",
  },
  brands: [
    { name: "John Gospel Fellowship", src: "/logos/jgf.jpeg", alt: "John Gospel Fellowship logo" },
    { name: "Emmaus Institute of Theology", src: "/logos/eit.png", alt: "Emmaus Institute of Theology logo" },
    { name: "Emmaus TV", src: "/logos/emmaus-tv.png", alt: "Emmaus TV logo" },
  ] as const,
} as const;

/** Primary navigation — kept intentionally short. */
export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/results", label: "Results" },
  { href: "/contact", label: "Contact" },
] as const;

/** Footer quick links — the everyday routes someone will want from the footer. */
export const footerQuickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/apply", label: "Apply Now" },
  { href: "/churches", label: "Churches" },
] as const;

/** Secondary exploration links — kept accessible from the footer. */
export const footerExploreLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/results", label: "Results" },
  { href: "/contact", label: "Contact" },
] as const;
