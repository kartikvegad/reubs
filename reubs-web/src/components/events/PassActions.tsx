"use client";

import { useState } from "react";

type PassPdfProps = {
  fileName: string;
  schoolName: string;
  eventTitle: string;
  eventWhen: string;
  venue: string;
  studentName: string;
  enrollment: string;
  classLabel: string;
  seats: string;
  quantityLabel: string;
  amountLabel: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  passCode: string;
  status: string;
  paymentLabel: string;
  issuedAt: string;
  qrDataUrl: string;
};

export function PassActions(props: PassPdfProps) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function downloadPdf() {
    setBusy(true);
    setNote("");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 48;
      let y = margin;

      doc.setFillColor(78, 18, 25);
      doc.rect(0, 0, 595, 120, "F");
      doc.setTextColor(196, 163, 90);
      doc.setFontSize(11);
      doc.text(`${props.schoolName}  ·  EVENT PASS`, margin, 36);
      doc.setTextColor(255, 253, 248);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      const titleLines = doc.splitTextToSize(props.eventTitle, 500);
      doc.text(titleLines, margin, 68);
      y = 150;

      doc.setTextColor(27, 20, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(props.eventWhen, margin, y);
      y += 18;
      doc.text(props.venue, margin, y);
      y += 28;

      doc.setFontSize(10);
      doc.setTextColor(122, 31, 43);
      doc.text("STUDENT", margin, y);
      doc.text("SEATS", 320, y);
      y += 16;
      doc.setTextColor(27, 20, 16);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(props.studentName, margin, y);
      doc.text(props.seats || "-", 320, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(107, 91, 79);
      doc.text(props.enrollment, margin, y);
      doc.text(props.quantityLabel, 320, y);
      y += 16;
      doc.text(props.classLabel, margin, y);
      doc.text(props.amountLabel, 320, y);
      y += 30;

      doc.setDrawColor(230, 215, 184);
      doc.line(margin, y, 595 - margin, y);
      y += 24;

      doc.setTextColor(122, 31, 43);
      doc.setFontSize(10);
      doc.text("BUYER / GUARDIAN", margin, y);
      y += 16;
      doc.setTextColor(27, 20, 16);
      doc.setFontSize(12);
      doc.text(props.buyerName, margin, y);
      y += 16;
      doc.setTextColor(107, 91, 79);
      doc.setFontSize(11);
      doc.text(props.buyerEmail, margin, y);
      y += 16;
      doc.text(props.buyerPhone, margin, y);
      y += 28;

      doc.setTextColor(122, 31, 43);
      doc.setFontSize(10);
      doc.text("PASS DETAILS", margin, y);
      y += 16;
      doc.setTextColor(27, 20, 16);
      doc.setFontSize(11);
      doc.text(`ID: ${props.passCode}`, margin, y);
      y += 16;
      doc.setTextColor(107, 91, 79);
      doc.text(`Status: ${props.status}`, margin, y);
      y += 16;
      doc.text(props.paymentLabel, margin, y);
      y += 16;
      doc.text(`Issued: ${props.issuedAt}`, margin, y);
      y += 36;

      doc.setTextColor(122, 31, 43);
      doc.setFontSize(10);
      doc.text("GATE QR", margin, y);
      y += 10;
      doc.addImage(props.qrDataUrl, "PNG", margin, y, 160, 160);
      doc.setTextColor(107, 91, 79);
      doc.setFontSize(10);
      doc.text(props.passCode, margin + 180, y + 50);
      doc.text("Show this QR at the gate.", margin + 180, y + 70);
      doc.text("Each pass can be scanned once.", margin + 180, y + 86);

      doc.save(`${props.fileName}.pdf`);
      setNote("PDF downloaded.");
    } catch {
      setNote("Could not create PDF. Try Print instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3 print:hidden">
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => void downloadPdf()}
          disabled={busy}
          className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
        >
          {busy ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-outline px-5 py-2.5 text-sm"
        >
          Print pass
        </button>
      </div>
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </div>
  );
}
