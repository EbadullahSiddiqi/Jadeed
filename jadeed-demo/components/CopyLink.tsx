"use client";

import { useState } from "react";

export default function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="rounded-full bg-[#c4a35a] px-4 py-2 text-sm text-[#07382b]"
      onClick={async () => {
        const absolute = value.startsWith("http")
          ? value
          : `${window.location.origin}${value}`;
        await navigator.clipboard.writeText(absolute);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : "Copy portal link"}
    </button>
  );
}
