/**
 * Partner call-to-action for one-to-one tuition.
 * External link, so it opens in a new tab and is marked as sponsored.
 */
const TUTOR_URL = "https://preply.com/en/?pref=MjA1MDc3OTA=&id=1793560453.016828&ep=w1";

export default function TutorCTA() {
  return (
    <a
      href={TUTOR_URL}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group mt-8 flex flex-col gap-3 rounded-2xl border border-limeDeep/25 bg-gradient-to-r from-[#f3f7e4] via-white to-[#f4f0e6] px-5 py-4 transition hover:border-limeDeep/50 hover:shadow-[0_2px_18px_rgba(20,22,28,0.06)] sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[13.5px] font-semibold leading-6 text-ink">To learn with human teachers and save 30% on your first lesson</p>
        <p className="mt-1 text-[11.5px] leading-5 text-ink/45">
          Marking tells you where the marks went; a teacher shows you how to stop losing them.
        </p>
      </div>
      <span className="shrink-0 self-start rounded-full bg-limeDeep px-4 py-2 text-[12.5px] font-semibold text-white transition group-hover:bg-ink sm:self-auto">
        Find a tutor →
      </span>
    </a>
  );
}
