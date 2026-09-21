import { randomBytes } from "crypto";
import QRCode from "qrcode";

export function createQrToken() {
  return randomBytes(24).toString("hex");
}

export function ticketPayload(token: string) {
  return `REUBS:${token}`;
}

export function parseTicketPayload(value: string) {
  const raw = value.trim();
  if (raw.startsWith("REUBS:")) return raw.slice(6);
  try {
    const url = new URL(raw);
    const fromQuery = url.searchParams.get("t") || url.pathname.split("/").pop();
    return fromQuery || raw;
  } catch {
    return raw;
  }
}

export async function makeQrDataUrl(token: string) {
  return QRCode.toDataURL(ticketPayload(token), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 360,
    color: { dark: "#1b1410", light: "#fffdf8" },
  });
}

export async function makeQrPng(token: string) {
  return QRCode.toBuffer(ticketPayload(token), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 360,
    type: "png",
  });
}
