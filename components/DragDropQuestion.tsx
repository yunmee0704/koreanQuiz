interface DragDropQuestionProps {
  prompt: string;
  tokens: string[];
  onSubmit: (answer: string) => void;
}

export default function DragDropQuestion({
  prompt,
  tokens,
  onSubmit
}: DragDropQuestionProps) {
  const moveToken = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tokens.length) {
      return;
    }
    const updated = [...tokens];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onSubmit(`__REORDER__${updated.join(" ")}`);
  };

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold text-emerald-900">{prompt}</p>
      <p className="text-sm text-emerald-700">Put the words in the correct order.</p>
      <ul className="space-y-2">
        {tokens.map((token, index) => (
          <li key={`${token}-${index}`} className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2">
            <span className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2">{token}</span>
            <button
              type="button"
              onClick={() => moveToken(index, -1)}
              className="rounded-lg border border-emerald-300 px-2 py-1"
              aria-label={`Move ${token} left`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveToken(index, 1)}
              className="rounded-lg border border-emerald-300 px-2 py-1"
              aria-label={`Move ${token} right`}
            >
              →
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onSubmit(tokens.join(" "))}
        className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white"
      >
        Check Order
      </button>
    </div>
  );
}
