import { readingTest1 } from "@/data/reading1";
import { readingTest2 } from "@/data/reading2";
import { listeningTest1, listeningTest2 } from "@/data/listening";
import type { ReadingTest, ListeningTest } from "@/lib/types";

export const readingTests: ReadingTest[] = [readingTest1, readingTest2];
export const listeningTests: ListeningTest[] = [listeningTest1, listeningTest2];

export function getReadingTest(id: string): ReadingTest | undefined {
  return readingTests.find((t) => t.id === id);
}

export function getListeningTest(id: string): ListeningTest | undefined {
  return listeningTests.find((t) => t.id === id);
}
