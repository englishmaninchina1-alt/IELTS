import { notFound } from "next/navigation";
import { getReadingTest } from "@/data";
import ReadingRunner from "@/components/ReadingRunner";

export function generateStaticParams() {
  return [{ testId: "mock-1" }, { testId: "mock-2" }];
}

export default async function ReadingTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getReadingTest(testId);
  if (!test) notFound();
  return <ReadingRunner test={test} />;
}
