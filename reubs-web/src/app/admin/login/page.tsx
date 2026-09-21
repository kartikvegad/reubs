import { StaffLoginForm } from "@/components/staff/StaffLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-maroon-deep px-5 py-16 text-paper">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Office</p>
        <h1 className="mt-3 font-display text-4xl">Staff console</h1>
        <StaffLoginForm next="/admin" />
      </div>
    </main>
  );
}
