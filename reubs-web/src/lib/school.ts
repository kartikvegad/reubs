export const school = {
  name: "REUBS Primary & Higher Secondary School",
  shortName: "REUBS",
  tagline: "An inspiring, friendly campus in the heart of Maninagar.",
  board: "CBSE",
  established: 1965,
  medium: "English",
  type: "Co-educational · Nursery to Class 12",
  phone: "+91 79 2546 8874",
  phoneAlt: "+91 98700 96242",
  email: "info@reubsschoolonline.com",
  address: "Prabhu Park, 7/A, Punit Maharaj Road, opp. Ramji Mandir, Balvatika, Maninagar, Ahmedabad, Gujarat 380008",
  hours: "Monday–Saturday, 8:00 AM – 3:00 PM",
  mapsQuery: "Reubs School Prabhu Park Punit Maharaj Road Maninagar Ahmedabad",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function formatInr(paise: number) {
  if (paise <= 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
