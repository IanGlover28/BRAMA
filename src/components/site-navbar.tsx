"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

// Pages with a full-bleed gradient band at the top — they own their own
// top spacing so the band runs under the floating navbar.
const FULL_BLEED_PATHS = ["/", "/account", "/about", "/learn", "/terms"];

export default function SiteNavbar() {
  const pathname = usePathname();
  const fullBleed = FULL_BLEED_PATHS.includes(pathname);

  return (
    <>
      <Navbar />
      {!fullBleed && <div className="pt-[120px] md:pt-[90px]" />}
    </>
  );
}