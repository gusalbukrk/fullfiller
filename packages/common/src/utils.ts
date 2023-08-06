import { flatOptionsType, optionsType } from './types';

export function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

export function capitalize(word: string): string {
  return word[0].toUpperCase() + word.substring(1);
}

export function isLowercase(str: string): boolean {
  return str === str.toLowerCase();
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomArrayElement<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function isNumeric(word: string): boolean {
  return /^[\d.,:%$]+$/.test(word) && /\d/.test(word);
}

export function escapeRegExp(regexpString: string): string {
  return regexpString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert `func(a, b, c)` to `func({ a, b, c })`.
 * The generic types parameters are inferred — I is the interface of the `defaults` object,
 * T is the tuple obtained from `fn` parameters, and RT is `fn` return type.
 * @param fn A function that takes a list of parameters.
 * @param defaults An object containing default values for `fn`
 * (its keys must share the same order as `fn` parameters).
 * @returns A wrapper to `fn` which takes an object instead of a list of parameters.
 */
export function paramsToObjParam<I, T extends unknown[], RT>(
  fn: (...params: T) => RT,
  defaults: I,
): (args?: Partial<I>) => RT {
  // defaults keys must follow same order as fn parameters
  // in args, keys can be in any order
  // because defaults are spread first which ensures the correct order
  return function fnWrapper(args: Partial<I> = {}) {
    return fn(...(Object.values({ ...defaults, ...args }) as T));
  };
}

/**
 * Apply `functions` to `input` left to right.
 * @param input
 * @param functions Array of functions.
 *  Function only argument and return value must be of the same type as `input`.
 * @returns Value of the same type as `input`.
 */
export function reduce<T>(input: T, functions: ((input: T) => T)[]): T {
  return functions.reduce((acc, fn) => fn(acc), input);
}

/** Check if argument is an object. */
export function isObject(input: unknown): input is Record<string, unknown> {
  return Object.prototype.toString.call(input) === '[object Object]';
}

/**
 * accepts numbers because it can be used to parse variables that're already typed as numbers
 * if it really is a number, argument is returned unchanged
 */
export function parseIntR10(n: string | number) {
  return parseInt(n as string, 10);
}

export function objectFilter<T extends Record<string, unknown>>(
  obj: T,
  predicate: ([k, v]: [string, unknown]) => boolean,
) {
  return Object.fromEntries(Object.entries(obj).filter(predicate)) as T;
}

export function unflattenBreakdownOptions(
  options: flatOptionsType,
): optionsType {
  return {
    // filter out flat breakdown options (e.g. wordsPerSentenceMin)
    ...objectFilter(
      options,
      ([k]) =>
        ![
          'sentencesPerParagraphMin',
          'sentencesPerParagraphMax',
          'wordsPerSentenceMin',
          'wordsPerSentenceMax',
        ].includes(k),
    ),

    // convert flat breakdown options to objects
    // e.g. wordsPerSentenceMin => wordsPerSentence.min
    //
    sentencesPerParagraph: {
      ...(options.sentencesPerParagraphMin !== undefined
        ? {
            min: parseIntR10(options.sentencesPerParagraphMin),
          }
        : {}),

      ...(options.sentencesPerParagraphMax !== undefined
        ? {
            max: parseIntR10(options.sentencesPerParagraphMax),
          }
        : {}),
    },
    //
    wordsPerSentence: {
      ...(options.wordsPerSentenceMin !== undefined
        ? {
            min: parseIntR10(options.wordsPerSentenceMin),
          }
        : {}),

      ...(options.wordsPerSentenceMax !== undefined
        ? {
            max: parseIntR10(options.wordsPerSentenceMax),
          }
        : {}),
    },
  };
}
