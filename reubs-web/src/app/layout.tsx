import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { school } from "@/lib/school";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: `${school.shortName} · ${school.board} School, Ahmedabad`,
    template: `%s · ${school.shortName}`,
  },
  description: `${school.name} is a ${school.board} English-medium school in Maninagar, Ahmedabad.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
