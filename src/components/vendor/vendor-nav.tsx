"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/vendor", label: "Dashboard" },
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/orders", label: "Orders" },
  { href: "/vendor/inbox", label: "Inbox" },
  { href: "/vendor/vouchers", label: "Vouchers" },
];

export default function VendorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => {
        const active =
          tab.href === "/vendor"
            ? pathname === "/vendor"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition ${
              active
                ? "text-pink-600 border-pink-600 font-semibold"
                : "text-gray-600 border-transparent hover:text-pink-600 hover:border-pink-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}