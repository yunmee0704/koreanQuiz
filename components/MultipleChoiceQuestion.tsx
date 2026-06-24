interface MultipleChoiceQuestionProps {
  prompt: string;
  choices: string[];
  onAnswer: (answer: string) => void;
  selected?: string;
}

export default function MultipleChoiceQuestion({
  prompt,
  choices,
  onAnswer,
  selected
}: MultipleChoiceQuestionProps) {
  return (
    <div>
      <p className="text-lg font-semibold text-emerald-900">{prompt}</p>
      <div className="mt-3 grid gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onAnswer(choice)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              selected === choice
                ? "border-emerald-500 bg-emerald-100"
                : "border-emerald-200 bg-white hover:border-emerald-400"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
