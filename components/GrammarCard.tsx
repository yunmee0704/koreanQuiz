import { ReactNode } from "react";

interface GrammarCardProps {
  title: string;
  children: ReactNode;
}

export default function GrammarCard({ title, children }: GrammarCardProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-semibold text-emerald-900">{title}</h2>
      <div className="mt-4 space-y-3 text-emerald-900">{children}</div>
    </section>
  );
}
