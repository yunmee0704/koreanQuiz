import { FormEvent, useState } from "react";

interface FillBlankQuestionProps {
  prompt: string;
  leftText: string;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export default function FillBlankQuestion({
  prompt,
  leftText,
  onSubmit,
  disabled = false
}: FillBlankQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-lg font-semibold text-emerald-900">{prompt}</p>
      <label className="block text-emerald-800">
        <span className="mb-2 block text-sm">Type the missing word:</span>
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-50 px-3 py-2">{leftText}</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            className="min-w-0 flex-1 rounded-xl border border-emerald-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            placeholder="Your answer"
          />
        </div>
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        Check
      </button>
    </form>
  );
}
