import { redirect } from "next/navigation";
import { ScannerApp } from "@/components/scan/ScannerApp";
import { getStaffSession } from "@/lib/auth";

export default async function ScanPage() {
  const staff = await getStaffSession();
  if (!staff) redirect("/scan/login");

  return <ScannerApp staffName={staff.name} staffRole={staff.role} />;
}
