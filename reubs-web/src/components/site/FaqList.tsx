"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Which classes does Reubs offer?",
    a: "Reubs is organised as a co-educational English-medium campus from the early years through higher secondary. Exact class availability for the current session is confirmed by the office at enquiry.",
  },
  {
    q: "Is Reubs a CBSE school?",
    a: "The school follows a CBSE-oriented academic path, with concept-based learning and continuous development. Official affiliation particulars, when published by the school, will appear here. [Affiliation number: to be confirmed]",
  },
  {
    q: "How can I enquire about admission?",
    a: "Use the enquiry form on the Contact or Admissions page, or call the school office during working hours. The office will guide you through counselling, application and documentation.",
  },
  {
    q: "How can parents register for school events?",
    a: "Open Events, choose a programme, select seats, and complete checkout with a current student enrollment number. A QR e-ticket is issued after confirmation.",
  },
  {
    q: "How are event passes issued?",
    a: "Passes are issued only against a verified Reubs enrollment number. Each booking stores seat numbers and buyer details. The QR code can be scanned once at the gate.",
  },
  {
    q: "Where can I find upcoming events?",
    a: "The Events page lists upcoming and past programmes, with dates, venues and registration status. The home page also highlights the next few dates.",
  },
  {
    q: "How can I contact the school?",
    a: "Phone, email and the campus address are listed under Contact. Office hours are Monday to Saturday. For admissions, mark your enquiry as Admissions on the form.",
  },
  {
    q: "Where can I find school announcements?",
    a: "News & Updates carries sample announcement cards that the school can replace with current notices, academic updates and event information.",
  },
  {
    q: "Does the school organise extracurricular activities?",
    a: "Student life at Reubs is planned around sports, arts, STEM work, clubs and leadership. The current year's activity calendar is issued by the school; listings on this site are structured for the office to keep current.",
  },
  {
    q: "Where can I view the school gallery?",
    a: "The Gallery page is organised by campus, classrooms, sports, cultural events, science and student activities.",
  },
];

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gold-soft border border-gold-soft bg-paper">
      {faqs.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-cream/70"
              onClick={() => setOpen(active ? null : index)}
              aria-expanded={active}
            >
              <span className="font-medium">{item.q}</span>
              <span
                className={`mt-0.5 text-maroon transition-transform duration-300 ${active ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div className={`faq-panel ${active ? "is-open" : ""}`}>
              <div>
                <p className="px-5 pb-5 leading-7 text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
