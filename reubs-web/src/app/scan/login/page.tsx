import { StaffLoginForm } from "@/components/staff/StaffLoginForm";

export default function ScanLoginPage() {
  return (
    <main className="min-h-screen bg-ink px-5 py-16 text-paper">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Gate desk</p>
        <h1 className="mt-3 font-display text-4xl">Scanner sign in</h1>
        <p className="mt-3 text-sm text-gold-soft">
          Staff only. Use this phone to scan event QR codes against the school database.
        </p>
        <StaffLoginForm next="/scan" />
      </div>
    </main>
  );
}
