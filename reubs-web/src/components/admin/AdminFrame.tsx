import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const staff = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-gold-soft bg-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">REUBS office</p>
            <p className="font-display text-xl text-maroon-deep">Console</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">{staff.name}</span>
            <Link href="/events" className="text-maroon">
              Public site
            </Link>
            <form>
              <button
                formAction={async () => {
                  "use server";
                  const { logoutStaff } = await import("@/lib/auth");
                  await logoutStaff();
                  const { redirect } = await import("next/navigation");
                  redirect("/admin/login");
                }}
                className="text-maroon"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">{children}</div>
    </div>
  );
}
