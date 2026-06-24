const sinoDigits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const nativeBase = [
  "",
  "하나",
  "둘",
  "셋",
  "넷",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉"
];
const nativeCounterBase = [
  "",
  "한",
  "두",
  "세",
  "네",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉"
];
const nativeTens = [
  "",
  "열",
  "스물",
  "서른",
  "마흔",
  "쉰",
  "예순",
  "일흔",
  "여든",
  "아흔"
];

export function toSinoKorean(num: number): string {
  if (num <= 0) {
    return "";
  }

  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const tensText = tens === 0 ? "" : tens === 1 ? "십" : `${sinoDigits[tens]}십`;
    return `${tensText}${sinoDigits[ones]}`;
  }

  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    const thousandText =
      thousands === 0 ? "" : thousands === 1 ? "천" : `${sinoDigits[thousands]}천`;
    const hundredText =
      hundreds === 0 ? "" : hundreds === 1 ? "백" : `${sinoDigits[hundreds]}백`;
    const tenText = tens === 0 ? "" : tens === 1 ? "십" : `${sinoDigits[tens]}십`;
    const oneText = ones === 0 ? "" : sinoDigits[ones];
    return `${thousandText}${hundredText}${tenText}${oneText}`;
  }

  return `${num}`;
}

export function toNativeKorean(num: number, useCounterForm: boolean): string {
  if (num <= 0 || num > 99) {
    return "";
  }

  if (num < 10) {
    return useCounterForm ? nativeCounterBase[num] : nativeBase[num];
  }

  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const tensText = nativeTens[tens];
  const onesList = useCounterForm ? nativeCounterBase : nativeBase;
  return `${tensText}${onesList[ones]}`;
}

export function nativeSystemNote(): string {
  return "Remember: 하나->한, 둘->두, 셋->세, 넷->네 with counters.";
}
