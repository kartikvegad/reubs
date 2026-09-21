"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Which classes does Reubs offer?",
    a: "Reubs is a co-educational English-medium school from the early years through higher secondary (Nursery to Class 12). Please contact the office for current seat availability.",
  },
  {
    q: "Is Reubs affiliated to CBSE?",
    a: "The school follows a CBSE-oriented academic programme with concept-based teaching and continuous assessment. Affiliation details are available from the school office on request.",
  },
  {
    q: "How do I enquire about admission?",
    a: "Submit an enquiry through the Admissions or Contact page, or call the school office during working hours. The office will guide you through counselling, application and documentation.",
  },
  {
    q: "How do parents register for school events?",
    a: "Open the Events page, select a programme, choose seats and complete registration with a current student enrollment number. A QR e-ticket is issued after confirmation.",
  },
  {
    q: "How are event passes issued?",
    a: "Passes are issued only against a verified Reubs enrollment number. Each booking records seat numbers and parent or guardian details. The QR code is scanned once at the gate.",
  },
  {
    q: "Where can I see upcoming events?",
    a: "The Events page lists upcoming and past programmes with dates, venues and registration status. Featured dates also appear on the home page.",
  },
  {
    q: "How can I contact the school?",
    a: "Phone, email and the campus address are listed on the Contact page. Office hours are Monday to Saturday. For admissions, mark your enquiry accordingly on the form.",
  },
  {
    q: "Where are school announcements published?",
    a: "Notices, academic updates and event information are published under News. Important circulars may also be shared directly by the school office.",
  },
  {
    q: "Does the school organise extracurricular activities?",
    a: "Yes. Student life includes sports, arts, STEM activities, clubs and leadership opportunities alongside the academic timetable.",
  },
  {
    q: "Where can I view the school gallery?",
    a: "The Gallery page presents photographs from campus life, classrooms, sports, cultural programmes and student activities.",
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
