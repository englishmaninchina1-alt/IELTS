import { SectionHead } from "@/components/ui";
import VocabTrainer from "@/components/VocabTrainer";

export const metadata = { title: "Vocabulary · Band Nine" };

export default function VocabularyPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Vocabulary"
        title="The words that move a band, not the ones that sound impressive."
        sub="Ten topics, collocations attached to every entry, and examples written the way an examiner expects to read them. Flashcard progress is saved in this browser."
      />
      <VocabTrainer />
    </div>
  );
}
