import { QuizStats } from "@/lib/types";

interface MasteryScreenProps {
  stats: QuizStats;
}

export default function MasteryScreen({ stats }: MasteryScreenProps) {
  const accuracy =
    stats.totalQuestions === 0
      ? 0
      : Math.round((stats.correctAnswers / stats.totalQuestions) * 100);

  return (
    <div className="rounded-3xl bg-white p-6 text-center shadow-sm md:p-8">
      <p className="text-4xl" aria-hidden="true">
        🎉
      </p>
      <h2 className="mt-3 text-2xl font-bold text-emerald-900">Congratulations!</h2>
      <p className="mt-2 text-emerald-800">
        You can now tell the difference between Native Korean numbers and Sino-Korean numbers.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 text-left md:grid-cols-5">
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Total Questions" value={stats.totalQuestions} />
        <StatCard label="Correct Answers" value={stats.correctAnswers} />
        <StatCard label="Incorrect Answers" value={stats.incorrectAnswers} />
        <StatCard label="Current Streak" value={stats.currentStreak} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-emerald-50 p-3">
      <p className="text-xs text-emerald-700">{label}</p>
      <p className="text-lg font-bold text-emerald-900">{value}</p>
    </div>
  );
}
