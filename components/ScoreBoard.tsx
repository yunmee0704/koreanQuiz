import { QuizStats } from "@/lib/types";

interface ScoreBoardProps {
  stats: QuizStats;
}

export default function ScoreBoard({ stats }: ScoreBoardProps) {
  const accuracy =
    stats.totalQuestions === 0
      ? 0
      : Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-5">
      <Metric label="Streak" value={stats.currentStreak} />
      <Metric label="Accuracy" value={`${accuracy}%`} />
      <Metric label="Total" value={stats.totalQuestions} />
      <Metric label="Correct" value={stats.correctAnswers} />
      <Metric label="Incorrect" value={stats.incorrectAnswers} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-emerald-50 p-3">
      <p className="text-xs uppercase tracking-wide text-emerald-700">{label}</p>
      <p className="text-lg font-bold text-emerald-900">{value}</p>
    </div>
  );
}
