import { SectionHead } from "@/components/ui";
import PronunciationCoach from "@/components/PronunciationCoach";

export const metadata = { title: "Pronunciation · Band Nine" };

export default function PronunciationPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Pronunciation"
        title="The band 7 and band 8 words that quietly lower your band."
        sub="High-level vocabulary is only worth the sounds you can deliver. Below are the 100 words expected at band 7 and the 100 that lift an answer to band 8, each with a natural British respelling and the one sound that usually goes wrong. Record yourself and get a mark out of 100 with specific fixes."
      />
      <PronunciationCoach />
    </div>
  );
}
