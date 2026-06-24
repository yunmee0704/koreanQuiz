interface ExplanationBoxProps {
  userAnswer: string;
  correctAnswer: string;
  reason: string;
  onTryAgain: () => void;
}

export default function ExplanationBox({
  userAnswer,
  correctAnswer,
  reason,
  onTryAgain
}: ExplanationBoxProps) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900"
      role="alert"
      aria-live="polite"
    >
      <p className="font-bold">Incorrect</p>
      <p className="mt-2 text-sm">Your answer: {userAnswer || "(empty)"}</p>
      <p className="text-sm">Correct answer: {correctAnswer}</p>
      <p className="mt-2 text-sm">{reason}</p>
      <button
        type="button"
        onClick={onTryAgain}
        className="mt-3 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white"
      >
        Try Again
      </button>
    </div>
  );
}
