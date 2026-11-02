// Minimal typings + factory for the (non-standard) Web Speech API used by the mic buttons.
// Keeps every `any` out of the components while staying safe on browsers without support.

export interface SpeechRecognitionResultLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export interface SpeechRecognitionLike {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  start: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export const getSpeechRecognition = (): SpeechRecognitionCtor | undefined => {
  if (typeof window === "undefined") return undefined;
  const scoped = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return scoped.SpeechRecognition || scoped.webkitSpeechRecognition;
};

export const isSpeechRecognitionSupported = (): boolean =>
  Boolean(getSpeechRecognition());
