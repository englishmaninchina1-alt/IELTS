import { SectionHead } from "@/components/ui";
import Coach from "@/components/Coach";

export const metadata = { title: "AI Coach · Band Nine" };

export default function CoachPage() {
  return (
    <div>
      <SectionHead
        eyebrow="AI Coach"
        title="Turn a blank page into an argument."
        sub="Most candidates do not lack vocabulary — they lack an idea worth developing. The coach identifies the topic, offers positions and arguments, then turns your own notes into a structured sample answer with a concession and a conclusion."
      />
      <Coach />
    </div>
  );
}
