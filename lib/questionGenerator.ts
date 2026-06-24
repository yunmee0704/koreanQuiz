import {
  ConceptDefinition,
  ConceptId,
  ConceptScore,
  NumberSystem,
  Question,
  QuestionType
} from "@/lib/types";

const nativeConcepts: ConceptDefinition[] = [
  { id: "native_counting", system: "native", englishLabel: "counting things", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "native_age", system: "native", englishLabel: "age", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "native_hours", system: "native", englishLabel: "hours", koreanUnit: "", numberMin: 1, numberMax: 12 }
];

const sinoConcepts: ConceptDefinition[] = [
  { id: "sino_minutes", system: "sino", englishLabel: "minutes", koreanUnit: "", numberMin: 1, numberMax: 59 },
  { id: "sino_money", system: "sino", englishLabel: "money", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "sino_dates", system: "sino", englishLabel: "dates", koreanUnit: "", numberMin: 1, numberMax: 31 },
  { id: "sino_phone_numbers", system: "sino", englishLabel: "phone numbers", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "sino_addresses", system: "sino", englishLabel: "addresses", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "sino_room_numbers", system: "sino", englishLabel: "room numbers", koreanUnit: "", numberMin: 1, numberMax: 10 },
  { id: "sino_math", system: "sino", englishLabel: "plus", koreanUnit: "", numberMin: 1, numberMax: 10 }
];

export const allConcepts = [...nativeConcepts, ...sinoConcepts];

const questionTypes: QuestionType[] = [
  "system_choice"
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function englishPrompt(concept: ConceptDefinition, num: number): string {
  if (concept.id === "native_counting") {
    return `${num} things`;
  }
  if (concept.id === "sino_phone_numbers") {
    return `phone number digit ${num}`;
  }
  if (concept.id === "sino_math") {
    const second = randomInt(1, 10);
    return `${num} + ${second}`;
  }
  if (concept.id === "sino_dates") {
    const month = randomInt(1, 12);
    return `${month}/${num} date`;
  }
  if (concept.id === "native_age") {
    return `${num} years old`;
  }
  if (concept.id === "native_hours") {
    return `${num} o'clock`;
  }
  if (concept.id === "sino_minutes") {
    return `${num} minutes`;
  }
  if (concept.id === "sino_money") {
    return `$${num}`;
  }
  if (concept.id === "sino_addresses") {
    return `address number ${num}`;
  }
  if (concept.id === "sino_room_numbers") {
    return `room number ${num}`;
  }
  return `${num} ${concept.englishLabel}`;
}

function makeSimpleExplanation(system: NumberSystem, prompt: string): string {
  if (system === "native") {
    return `${prompt} uses Native Korean numbers.`;
  }
  return `${prompt} uses Sino-Korean numbers.`;
}

function conceptWeight(conceptId: ConceptId, scores: Record<ConceptId, ConceptScore>, focusQueue: ConceptId[]): number {
  const base = scores[conceptId];
  const weakness = Math.max(0, base.attempts - base.correct);
  const queueBoost = focusQueue.includes(conceptId) ? 5 : 0;
  const wrongBoost = base.wrongInRow * 2;
  return 1 + weakness + queueBoost + wrongBoost;
}

function pickConcept(scores: Record<ConceptId, ConceptScore>, focusQueue: ConceptId[]): ConceptDefinition {
  if (focusQueue.length > 0 && Math.random() < 0.45) {
    const id = focusQueue.shift() as ConceptId;
    return allConcepts.find((c) => c.id === id) ?? randomItem(allConcepts);
  }

  const weighted = allConcepts.map((concept) => ({
    concept,
    weight: conceptWeight(concept.id, scores, focusQueue)
  }));

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.concept;
    }
  }
  return weighted[0].concept;
}

export function createQuestion(
  scores: Record<ConceptId, ConceptScore>,
  focusQueue: ConceptId[],
  lastSignature: string
): Question {
  let attempts = 0;
  while (attempts < 12) {
    attempts += 1;
    const concept = pickConcept(scores, focusQueue);
    const num = randomInt(concept.numberMin, concept.numberMax);
    const type = randomItem(questionTypes);
    const prompt = englishPrompt(concept, num);
    const koreanPrompt = "";
    const correctSystemText = concept.system === "native" ? "Native Korean" : "Sino-Korean";
    const explanation = makeSimpleExplanation(concept.system, prompt);
    let choices: string[] | undefined;
    let correctAnswer = correctSystemText;

    if (type === "system_choice") {
      choices = ["Native Korean", "Sino-Korean"];
      correctAnswer = correctSystemText;
    }

    const signature = `${concept.id}-${num}-${type}`;
    if (signature === lastSignature) {
      continue;
    }

    return {
      id: `${Date.now()}-${Math.random()}`,
      type,
      conceptId: concept.id,
      conceptLabel: concept.englishLabel,
      system: concept.system,
      prompt,
      koreanPrompt,
      correctAnswer,
      choices,
      explanation,
      signature
    };
  }

  const fallbackConcept = randomItem(allConcepts);
  const fallbackNum = randomInt(fallbackConcept.numberMin, fallbackConcept.numberMax);
  const fallbackPrompt = englishPrompt(fallbackConcept, fallbackNum);
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: "system_choice",
    conceptId: fallbackConcept.id,
    conceptLabel: fallbackConcept.englishLabel,
    system: fallbackConcept.system,
    prompt: fallbackPrompt,
    koreanPrompt: "",
    correctAnswer: fallbackConcept.system === "native" ? "Native Korean" : "Sino-Korean",
    choices: ["Native Korean", "Sino-Korean"],
    explanation: makeSimpleExplanation(fallbackConcept.system, fallbackPrompt),
    signature: `${fallbackConcept.id}-${fallbackNum}-system_choice`
  };
}

export function makeConceptScoreMap(): Record<ConceptId, ConceptScore> {
  return allConcepts.reduce(
    (acc, concept) => ({
      ...acc,
      [concept.id]: { attempts: 0, correct: 0, wrongInRow: 0 }
    }),
    {} as Record<ConceptId, ConceptScore>
  );
}
