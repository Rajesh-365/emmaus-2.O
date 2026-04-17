export type GallerySeed = {
  src: string;
  alt: string;
  category: "Gospel Crusades" | "JGF Activities" | "Churches";
};

export const galleryItems: GallerySeed[] = [
  { src: "/gallery/crusade-01.jpg",    alt: "Open-air Gospel crusade at sunset",           category: "Gospel Crusades" },
  { src: "/gallery/activity-01.jpg",   alt: "JGF ministry team in the field",              category: "JGF Activities" },
  { src: "/gallery/crusade-02.jpg",    alt: "Worship gathering during a Gospel crusade",   category: "Gospel Crusades" },
  { src: "/gallery/activity-02.jpg",   alt: "Outreach service among unreached communities", category: "JGF Activities" },
  { src: "/gallery/church-boppudi.png", alt: "JGF church plant — Boppudi congregation",    category: "Churches" },
  { src: "/gallery/crusade-03.jpg",    alt: "Crowd at a village Gospel crusade",           category: "Gospel Crusades" },
  { src: "/gallery/activity-03.jpg",   alt: "Community ministry — JGF outreach",           category: "JGF Activities" },
  { src: "/gallery/crusade-04.jpg",    alt: "Gospel preaching during a crusade",           category: "Gospel Crusades" },
  { src: "/gallery/activity-04.jpg",   alt: "Discipleship gathering",                      category: "JGF Activities" },
];
