import { StaffLoginForm } from "@/components/staff/StaffLoginForm";

export default function ScanLoginPage() {
  return (
    <main className="gate-login">
      <div className="gate-login-card">
        <p className="gate-brand">REUBS</p>
        <h1 className="gate-login-title">Gate check-in</h1>
        <p className="gate-login-copy">
          Sign in to scan event passes. Use a phone with a working camera at the gate.
        </p>
        <StaffLoginForm next="/scan" />
        <p className="gate-login-hint">
          Demo: <span>scanner@reubs.school</span> / <span>ScanGate@2026</span>
        </p>
      </div>
    </main>
  );
}
