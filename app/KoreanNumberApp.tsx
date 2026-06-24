"use client";

import { useMemo, useState } from "react";
import DragDropQuestion from "@/components/DragDropQuestion";
import ErrorCorrectionQuestion from "@/components/ErrorCorrectionQuestion";
import ExplanationBox from "@/components/ExplanationBox";
import FillBlankQuestion from "@/components/FillBlankQuestion";
import GrammarCard from "@/components/GrammarCard";
import Header from "@/components/Header";
import MasteryScreen from "@/components/MasteryScreen";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import Pagination from "@/components/Pagination";
import ProgressBar from "@/components/ProgressBar";
import QuizCard from "@/components/QuizCard";
import ScoreBoard from "@/components/ScoreBoard";
import { createQuestion, makeConceptScoreMap } from "@/lib/questionGenerator";
import { ConceptId, Question, QuizStats } from "@/lib/types";

const MASTER_STREAK = 20;
const QUESTIONS_PER_PAGE = 5;

type ScreenMode = "intro" | "quiz" | "mastery";

interface AnswerState {
  selected: string;
  solved: boolean;
  incorrect: boolean;
  explanationVisible: boolean;
  reorderTokens?: string[];
}

function normalize(text: string): string {
  return text.replace(/\s+/g, "").trim();
}

function makeQuestionBatch(
  scores: ReturnType<typeof makeConceptScoreMap>,
  focusQueue: ConceptId[],
  lastSignature: string,
  count = QUESTIONS_PER_PAGE
) {
  const batch: Question[] = [];
  const queueCopy = [...focusQueue];
  let signature = lastSignature;
  for (let i = 0; i < count; i += 1) {
    const question = createQuestion(scores, queueCopy, signature);
    batch.push(question);
    signature = question.signature;
  }
  return { batch, signature, remainingQueue: queueCopy };
}

export default function KoreanNumberApp() {
  const [mode, setMode] = useState<ScreenMode>("intro");
  const [quizPages, setQuizPages] = useState<Question[][]>([]);
  const [quizPageIndex, setQuizPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [lastSignature, setLastSignature] = useState("");
  const [conceptScores, setConceptScores] = useState(makeConceptScoreMap);
  const [focusQueue, setFocusQueue] = useState<ConceptId[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    currentStreak: 0
  });

  const currentPageQuestions = quizPages[quizPageIndex] ?? [];
  const solvedCount = currentPageQuestions.filter((question) => answers[question.id]?.solved).length;
  const currentPageNumber = mode === "intro" ? 1 : mode === "quiz" ? quizPageIndex + 2 : quizPages.length + 2;
  const accuracy = useMemo(() => {
    if (stats.totalQuestions === 0) {
      return 0;
    }
    return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  }, [stats.correctAnswers, stats.totalQuestions]);

  const updateScoreCorrect = (conceptId: ConceptId) => {
    setConceptScores((prev) => ({
      ...prev,
      [conceptId]: {
        attempts: prev[conceptId].attempts + 1,
        correct: prev[conceptId].correct + 1,
        wrongInRow: 0
      }
    }));
  };

  const updateScoreWrong = (conceptId: ConceptId) => {
    setConceptScores((prev) => ({
      ...prev,
      [conceptId]: {
        attempts: prev[conceptId].attempts + 1,
        correct: prev[conceptId].correct,
        wrongInRow: prev[conceptId].wrongInRow + 1
      }
    }));
    setFocusQueue((prev) => [...prev, conceptId]);
  };

  const nextQuestionPage = () => {
    const { batch, signature, remainingQueue } = makeQuestionBatch(
      conceptScores,
      focusQueue,
      lastSignature
    );
    setQuizPages((prev) => [...prev, batch]);
    setLastSignature(signature);
    setFocusQueue(remainingQueue);
  };

  const startQuiz = () => {
    if (quizPages.length === 0) {
      const { batch, signature, remainingQueue } = makeQuestionBatch(
        conceptScores,
        focusQueue,
        lastSignature
      );
      setQuizPages([batch]);
      setLastSignature(signature);
      setFocusQueue(remainingQueue);
      setQuizPageIndex(0);
    }
    setMode("quiz");
  };

  const handleAnswer = (question: Question, userAnswer: string) => {
    if (answers[question.id]?.solved) {
      return;
    }

    if (userAnswer.startsWith("__REORDER__")) {
      const tokens = userAnswer.replace("__REORDER__", "").split(" ");
      setAnswers((prev) => ({
        ...prev,
        [question.id]: {
          ...(prev[question.id] ?? {
            selected: "",
            solved: false,
            incorrect: false,
            explanationVisible: false
          }),
          reorderTokens: tokens
        }
      }));
      return;
    }

    const isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);

    if (isCorrect) {
      updateScoreCorrect(question.conceptId);
      setStats((prev) => {
        const next = {
          totalQuestions: prev.totalQuestions + 1,
          correctAnswers: prev.correctAnswers + 1,
          incorrectAnswers: prev.incorrectAnswers,
          currentStreak: prev.currentStreak + 1
        };
        if (next.currentStreak >= MASTER_STREAK) {
          setMode("mastery");
        }
        return next;
      });
      setAnswers((prev) => ({
        ...prev,
        [question.id]: {
          ...(prev[question.id] ?? {
            selected: "",
            solved: false,
            incorrect: false,
            explanationVisible: false
          }),
          selected: userAnswer,
          solved: true,
          incorrect: false,
          explanationVisible: false
        }
      }));
      return;
    }

    updateScoreWrong(question.conceptId);
    setStats((prev) => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers,
      incorrectAnswers: prev.incorrectAnswers + 1,
      currentStreak: 0
    }));
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...(prev[question.id] ?? {
          selected: "",
          solved: false,
          incorrect: false,
          explanationVisible: false
        }),
        selected: userAnswer,
        solved: false,
        incorrect: true,
        explanationVisible: true
      }
    }));
  };

  const tryAgain = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? {
          selected: "",
          solved: false,
          incorrect: false,
          explanationVisible: false
        }),
        explanationVisible: false,
        incorrect: false,
        selected: ""
      }
    }));
  };

  const goNext = () => {
    if (mode === "intro") {
      startQuiz();
      return;
    }
    if (mode === "quiz") {
      if (solvedCount < QUESTIONS_PER_PAGE) {
        return;
      }
      if (quizPageIndex < quizPages.length - 1) {
        setQuizPageIndex((prev) => prev + 1);
        return;
      }
      nextQuestionPage();
      setQuizPageIndex((prev) => prev + 1);
      return;
    }
    const resetBatch = makeQuestionBatch(makeConceptScoreMap(), [], "");
    setQuizPages([resetBatch.batch]);
    setQuizPageIndex(0);
    setAnswers({});
    setStats({
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      currentStreak: 0
    });
    setConceptScores(makeConceptScoreMap());
    setFocusQueue([]);
    setLastSignature(resetBatch.signature);
    setMode("intro");
  };

  const goPrevious = () => {
    if (mode === "intro") {
      return;
    }
    if (mode === "quiz" && quizPageIndex > 0) {
      setQuizPageIndex((prev) => prev - 1);
      return;
    }
    if (mode === "quiz" && quizPageIndex === 0) {
      setMode("intro");
      return;
    }
    if (mode === "mastery") {
      setMode("quiz");
      setQuizPageIndex(Math.max(0, quizPages.length - 1));
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 md:space-y-5 md:py-8">
      <Header
        title="Korean Numbers: Two Different Systems"
        subtitle="Simple practice for English beginners. Learn Native Korean and Sino-Korean numbers."
      />

      {mode !== "mastery" && <ScoreBoard stats={stats} />}
      {mode !== "mastery" && <ProgressBar current={stats.currentStreak} target={MASTER_STREAK} />}

      {mode === "intro" && (
        <div className="space-y-4">
          <GrammarCard title="Native Korean Numbers">
            <p>Korean uses two different number systems.</p>
            <p>Use Native Korean for counting things, age, and hours.</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>3 things</li>
              <li>7 years old</li>
              <li>4 o&apos;clock</li>
            </ul>
            <NumberTable
              rows={[
                ["1", "하나"],
                ["2", "둘"],
                ["3", "셋"],
                ["4", "넷"],
                ["5", "다섯"],
                ["6", "여섯"],
                ["7", "일곱"],
                ["8", "여덟"],
                ["9", "아홉"],
                ["10", "열"]
              ]}
            />
            <p>Tip: This app focuses on when to use each system, not unit words.</p>
          </GrammarCard>

          <GrammarCard title="Sino-Korean Numbers">
            <p>Use Sino-Korean for dates, money, minutes, phone numbers, addresses, room numbers, and math.</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>3 minutes</li>
              <li>$4</li>
              <li>5/9 date</li>
            </ul>
            <NumberTable
              rows={[
                ["1", "일"],
                ["2", "이"],
                ["3", "삼"],
                ["4", "사"],
                ["5", "오"],
                ["6", "육"],
                ["7", "칠"],
                ["8", "팔"],
                ["9", "구"],
                ["10", "십"]
              ]}
            />
            <p className="font-semibold">Don&apos;t memorize rules only. Practice many examples.</p>
          </GrammarCard>
        </div>
      )}

      {mode === "quiz" && (
        <section className="space-y-4" aria-live="polite">
          <p className="text-sm text-emerald-800">
            Solve 5 questions on this page. Wrong answers reset streak to 0.
          </p>
          {currentPageQuestions.map((question, index) => {
            const state = answers[question.id];
            const reorderTokens = state?.reorderTokens ?? question.tokens ?? [];
            const solved = state?.solved ?? false;
            return (
              <QuizCard key={question.id}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-700">
                    Q{index + 1} - {question.conceptLabel}
                  </p>
                  {solved && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Correct</span>}
                </div>

                {(question.type === "system_choice" ||
                  question.type === "multiple_choice" ||
                  question.type === "sentence_choice") &&
                  question.choices && (
                    <MultipleChoiceQuestion
                      prompt={question.prompt}
                      choices={question.choices}
                      onAnswer={(value) => handleAnswer(question, value)}
                      selected={state?.selected}
                    />
                  )}

                {question.type === "translate" && (
                  <FillBlankQuestion
                    prompt={`Translate into Korean: ${question.prompt}`}
                    leftText="Korean:"
                    onSubmit={(value) => handleAnswer(question, value)}
                    disabled={solved}
                  />
                )}

                {question.type === "fill_blank" && (
                  <FillBlankQuestion
                    prompt={`Fill the blank: ${question.prompt}`}
                    leftText={question.koreanPrompt.replace(` ${question.correctAnswer}`, "")}
                    onSubmit={(value) => handleAnswer(question, value)}
                    disabled={solved}
                  />
                )}

                {question.type === "error_correction" && (
                  <ErrorCorrectionQuestion
                    prompt={question.prompt}
                    onSubmit={(value) => handleAnswer(question, value)}
                  />
                )}

                {question.type === "drag_reorder" && (
                  <DragDropQuestion
                    prompt={`Put in order: ${question.prompt}`}
                    tokens={reorderTokens}
                    onSubmit={(value) => handleAnswer(question, value)}
                  />
                )}

                {state?.explanationVisible && (
                  <div className="mt-3">
                    <ExplanationBox
                      userAnswer={state.selected}
                      correctAnswer={question.correctAnswer}
                      reason={question.explanation}
                      onTryAgain={() => tryAgain(question.id)}
                    />
                  </div>
                )}
              </QuizCard>
            );
          })}
          <p className="text-sm text-emerald-700">
            Page progress: {solvedCount}/{QUESTIONS_PER_PAGE} solved | Accuracy: {accuracy}%
          </p>
        </section>
      )}

      {mode === "mastery" && <MasteryScreen stats={stats} />}

      <Pagination
        page={currentPageNumber}
        onPrevious={goPrevious}
        onNext={goNext}
        disablePrevious={mode === "intro"}
        disableNext={mode === "quiz" && solvedCount < QUESTIONS_PER_PAGE}
      />
    </main>
  );
}

function NumberTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200">
      <table className="w-full border-collapse text-left">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-3 py-2 text-sm font-semibold text-emerald-900">Number</th>
            <th className="px-3 py-2 text-sm font-semibold text-emerald-900">Korean</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([number, korean]) => (
            <tr key={number} className="border-t border-emerald-100">
              <td className="px-3 py-2">{number}</td>
              <td className="px-3 py-2">{korean}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
