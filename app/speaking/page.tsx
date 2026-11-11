import { SectionHead } from "@/components/ui";
import SpeakingStudio from "@/components/SpeakingStudio";
import SpeakingExam from "@/components/SpeakingExam";

export const metadata = { title: "Speaking practice · Band Nine" };

export default function SpeakingPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Speaking"
        title="A real mock exam: one minute to prepare, two minutes to speak."
        sub="Choose a topic, run the timers, record yourself and transcribe your answer. You get a criteria-by-criteria estimate and a band-8 model to compare against."
      />

      <div className="mb-6">
        <SpeakingExam />
      </div>

      <div id="record">
        <SpeakingStudio />
      </div>
    </div>
  );
}
