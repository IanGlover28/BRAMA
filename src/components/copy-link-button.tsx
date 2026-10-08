"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link2, Check } from "lucide-react";

export default function CopyLinkButton({
  path,
  label = "Copy link",
  className = "",
}: {
  path: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy link"
      className={`inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-gray-700 border border-white/40 shadow-md hover:text-pink-600 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${className}`}
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      {copied ? "Copied!" : label}
    </button>
  );
}