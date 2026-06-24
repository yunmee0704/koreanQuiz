interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-emerald-800">
        <span>Mastery Progress</span>
        <span>{current} / {target}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-emerald-100">
        <div
          className="h-3 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
