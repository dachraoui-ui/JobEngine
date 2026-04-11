import { ReactNode } from "react";
import { CandidateSidebar } from "./CandidateSidebar";
import { CandidateTopBar } from "./CandidateTopBar";

export function CandidateLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen bg-background">
      <CandidateSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Light leaks */}
        <div className="light-leak w-[500px] h-[500px] bg-primary -top-40 -right-40 fixed" />
        <div className="light-leak w-[400px] h-[400px] bg-secondary top-1/2 -left-20 fixed" />

        <CandidateTopBar title={title} />
        <main className="flex-1 px-4 md:px-8 pb-24 md:pb-8 dot-grid">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
