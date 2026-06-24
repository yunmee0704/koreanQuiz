import { FormEvent, useState } from "react";

interface ErrorCorrectionQuestionProps {
  prompt: string;
  onSubmit: (answer: string) => void;
}

export default function ErrorCorrectionQuestion({
  prompt,
  onSubmit
}: ErrorCorrectionQuestionProps) {
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
      <p className="text-sm text-emerald-700">Fix it with the correct Korean sentence.</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-xl border border-emerald-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        placeholder="Type the correct sentence"
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white"
      >
        Check
      </button>
    </form>
  );
}
