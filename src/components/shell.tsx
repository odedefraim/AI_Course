import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-paper-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-extrabold tracking-tight">
            כיתת בינה
          </Link>
          <p className="text-sm text-muted">חידון כיתתי · ח׳–ט׳</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 max-w-full rounded-card border border-line bg-paper-2 p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}
