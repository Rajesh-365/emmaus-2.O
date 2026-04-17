import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { Story } from "@/components/sections/Story";
import { MissionVision } from "@/components/sections/MissionVision";
import { CoursesPreview } from "@/components/sections/CoursesPreview";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { EmmausTVSection } from "@/components/sections/EmmausTV";
import { CallToAction } from "@/components/sections/CallToAction";
import { getAllCourses, getAllGallery } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, gallery] = await Promise.all([getAllCourses(), getAllGallery()]);
  return (
    <>
      <Hero />
      <Pillars />
      <Story />
      <MissionVision />
      <CoursesPreview courses={courses} />
      <GalleryPreview items={gallery} />
      <EmmausTVSection />
      <CallToAction />
    </>
  );
}
