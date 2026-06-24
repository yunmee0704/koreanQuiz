import { ReactNode } from "react";

interface QuizCardProps {
  children: ReactNode;
}

export default function QuizCard({ children }: QuizCardProps) {
  return <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">{children}</div>;
}
