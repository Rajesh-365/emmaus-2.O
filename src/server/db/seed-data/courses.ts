import type { CourseLevel } from "@/data/courses";

export type CourseSeed = {
  slug: string;
  code: string;
  name: string;
  duration: string;
  semesters: number;
  level: CourseLevel;
  tier: 1 | 2 | 3 | 4;
  summary: string;
  description: string;
  highlights: string[];
  eligibility: string;
};

export const courses: CourseSeed[] = [
  {
    slug: "certificate-in-theology",
    code: "C.Th",
    name: "Certificate in Theology",
    duration: "8 months",
    semesters: 2,
    level: "Foundation",
    tier: 1,
    summary: "A foundation in Scripture and Christian doctrine for new disciples.",
    description:
      "The Certificate in Theology gives new believers and lay workers a grounded introduction to the Bible, core Christian doctrine, and the habits of daily ministry. It is the shortest full programme at Emmaus.",
    highlights: ["Biblical Studies", "Christian Doctrine", "Ministry Basics", "Personal Discipleship"],
    eligibility: "Open to believers with a pastor's reference. No formal academic prerequisite.",
  },
  {
    slug: "diploma-in-theology",
    code: "D.Th",
    name: "Diploma in Theology",
    duration: "12 months",
    semesters: 2,
    level: "Intermediate",
    tier: 2,
    summary: "A comprehensive programme for those called to full-time ministry.",
    description:
      "The Diploma deepens biblical exegesis, broadens pastoral skill, and introduces church history and homiletics. Built for those serving local congregations or preparing for further study.",
    highlights: ["Advanced Biblical Studies", "Church History", "Pastoral Care", "Homiletics"],
    eligibility: "10th standard or equivalent, with a pastor's reference.",
  },
  {
    slug: "bachelor-of-theology",
    code: "B.Th",
    name: "Bachelor of Theology",
    duration: "12 months",
    semesters: 3,
    level: "Advanced",
    tier: 3,
    summary: "A complete undergraduate theological degree for the local church.",
    description:
      "The B.Th covers systematic theology, biblical languages, and ministry leadership over three focused semesters. Graduates emerge ready to teach, preach, and plant.",
    highlights: ["Systematic Theology", "Biblical Languages", "Homiletics", "Leadership"],
    eligibility: "12th standard or equivalent, with a pastor's reference.",
  },
  {
    slug: "master-of-theology",
    code: "M.Th",
    name: "Master of Theology",
    duration: "18 months",
    semesters: 3,
    level: "Mastery",
    tier: 4,
    summary: "Advanced postgraduate study for teachers, pastors, and theologians.",
    description:
      "The M.Th is our flagship postgraduate programme — rigorous research, advanced theology, and ministry leadership prepared for the next generation of Indian evangelical scholars and leaders.",
    highlights: ["Research Methods", "Advanced Theology", "Missiology", "Leadership"],
    eligibility: "An undergraduate degree (B.Th preferred) and a pastor's reference.",
  },
];
