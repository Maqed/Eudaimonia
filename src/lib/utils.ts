import { User } from "next-auth";
import { type ClassValue, clsx } from "clsx";
import { differenceInDays, isToday } from "date-fns";
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

export function getHabitCompletedAt(user: User, groupId: string) {
  return user.groups.find((group) => group.groupId === groupId)
    ?.habitCompletedAt;
}

export function getDailyStreak(habitCompletedAt: Date[] | undefined) {
  console.log(habitCompletedAt);
  if (!habitCompletedAt) return 0;
  if (habitCompletedAt.length === 0) {
    return 0;
  }

  const lastCompletedDate =
    habitCompletedAt[habitCompletedAt.length - 1]?.toLocaleDateString();

  if (
    !lastCompletedDate ||
    (!isToday(lastCompletedDate) &&
      differenceInDays(new Date().toLocaleDateString(), lastCompletedDate) !==
        1)
  ) {
    return 0;
  }

  if (
    (isToday(lastCompletedDate) ||
      differenceInDays(new Date().toLocaleDateString(), lastCompletedDate) ===
        1) &&
    habitCompletedAt.length === 1
  ) {
    return 1;
  }
  let streak = 1;

  for (let i = habitCompletedAt.length - 1; i >= 1; i--) {
    const diff = differenceInDays(
      habitCompletedAt[i]?.toLocaleDateString() ?? "",
      habitCompletedAt[i - 1]?.toLocaleDateString() ?? "",
    ); // Use non-null assertion (!)
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
