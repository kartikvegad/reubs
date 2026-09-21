import { AdminFrame } from "@/components/admin/AdminFrame";

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
