import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beauty Tutorials & Skincare Tips",
  description:
    "Step-by-step skincare routines, makeup tutorials and beauty tips from BRAMA Cosmetics.",
  alternates: { canonical: "/learn" },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
