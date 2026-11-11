import { SectionHead } from "@/components/ui";
import WritingStudio from "@/components/WritingStudio";

export const metadata = { title: "Writing practice · Band Nine" };

export default function WritingPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Writing"
        title="Write under exam conditions, then get the criteria back."
        sub="Five Task 1 charts and eight Task 2 questions on current topics. Every submission is measured against the four official criteria and returned with the specific fixes that would raise your band."
      />
      <WritingStudio />
    </div>
  );
}
