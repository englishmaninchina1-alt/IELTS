import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import TutorCTA from "@/components/TutorCTA";
import SiteBanner from "@/components/SiteBanner";
import Tracker from "@/components/Tracker";
import ProgressSync from "@/components/ProgressSync";
import Statcounter from "@/components/Statcounter";

export const metadata: Metadata = {
  title: "Band Nine — IELTS practice that scores you honestly",
  description:
    "Interactive IELTS preparation: full mock tests for Reading, Listening, Writing and Speaking with band-score feedback, current topics, vocabulary and grammar training, and an AI coach that turns your ideas into sample answers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Tracker />
        <ProgressSync />
        <Nav />
        <main className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-6 sm:px-6">
          <SiteBanner />
          {children}
          <TutorCTA />
        </main>
        <footer className="border-t border-ink/10 px-6 py-8 text-center text-xs text-ink/35">
          <p>
            Band Nine is an independent study tool. It is not affiliated with the IELTS partners. Reading and Listening scores use the
            published raw-score conversion tables; Writing and Speaking scores are rubric-based estimates, not official examiner marks.
          </p>
          <p className="mt-2">
            Progress is stored in this browser. Sign in and it is also saved to your account, so it follows you to other devices.
          </p>
        </footer>
        <Statcounter />
      </body>
    </html>
  );
}
