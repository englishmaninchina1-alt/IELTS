import { notFound } from "next/navigation";
import { getListeningTest } from "@/data";
import ListeningRunner from "@/components/ListeningRunner";

export function generateStaticParams() {
  return [{ testId: "mock-1" }, { testId: "mock-2" }];
}

export default async function ListeningTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getListeningTest(testId);
  if (!test) notFound();
  return <ListeningRunner test={test} />;
}
