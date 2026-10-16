import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BackToAccount({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/account"
      className={`inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600 transition-colors ${className}`}
    >
      <ChevronLeft size={16} />
      Back to My Account
    </Link>
  );
}