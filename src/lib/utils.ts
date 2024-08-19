import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstLettersOfWords(str: string | null | undefined) {
  if (!str) return;
  const words = str.split(" ");
  let output = "";
  for (const word of words) {
    if (word) {
      const firstLetter = word[0];
      output += firstLetter;
    }
  }
  return output;
}
