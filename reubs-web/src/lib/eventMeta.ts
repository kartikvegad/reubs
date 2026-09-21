import { img } from "./media";

export function eventAudience(category: string) {
  const map: Record<string, string> = {
    Culture: "Students, parents and invited guests",
    Sports: "Students, families and staff",
    Academics: "Students and accompanying parents",
    Community: "Reubs families and visitors with a pass",
    Workshop: "Registered students and parents",
    Orientation: "New families and class teachers",
  };
  return map[category] || "Reubs students and families";
}

export function registrationLabel(open: boolean, upcoming: boolean, left: number) {
  if (!upcoming) return "Closed · past event";
  if (!open || left <= 0) return "Registration closed";
  if (left < 30) return "Open · limited seats";
  return "Open · register for a pass";
}

export const demoPastEvents = [
  {
    slug: "independence-day-2026",
    title: "Independence Day assembly",
    category: "Celebrations",
    summary: "Flag ceremony and a short cultural programme. Demo listing for the office to replace.",
    date: "15 Aug 2026",
    time: "8:00 AM",
    venue: "Assembly court",
    audience: "Whole school · families by invitation",
    image: img.students,
  },
  {
    slug: "parent-orientation-2026",
    title: "Parent orientation",
    category: "Parent orientation",
    summary: "A walk through the year’s rhythm for new families. Sample card — not a live booking.",
    date: "18 Aug 2026",
    time: "5:00 PM",
    venue: "REUBS Auditorium",
    audience: "New parents and guardians",
    image: img.assembly,
  },
  {
    slug: "workshop-week-2026",
    title: "Workshop week",
    category: "Workshops",
    summary: "Skill sessions in the senior block. Replace with the school’s confirmed programme.",
    date: "2–6 Aug 2026",
    time: "During school hours",
    venue: "Senior block",
    audience: "Middle and secondary students",
    image: img.workshop,
  },
];

export const demoCalendar = [
  ["Annual Day", "Students performing on stage"],
  ["Sports Day", "Athletics and house finals on the ground"],
  ["Cultural festival", "Music, dance and theatre"],
  ["Science exhibition", "Student projects and demonstrations"],
  ["Inter-school competitions", "When the year’s calendar includes them"],
  ["Parent orientation", "For families joining the campus"],
  ["Workshops", "Skill and parent-facing sessions"],
  ["Career guidance", "Higher secondary conversations"],
  ["Academic events", "Exhibitions, olympiads, open houses"],
  ["School fests", "Community evenings on campus"],
];
