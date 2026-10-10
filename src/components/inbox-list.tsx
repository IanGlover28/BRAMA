"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MailOpen, MessageSquareText } from "lucide-react";

export interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  readAt: string | Date | null;
  createdAt: string | Date;
}

const SENDER_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  vendor: { label: "BRAMA Vendor", icon: MessageSquareText, color: "text-pink-600 bg-pink-100" },
  system: { label: "Notification", icon: Bell, color: "text-blue-600 bg-blue-100" },
};

export default function InboxList({ initialMessages }: { initialMessages: InboxMessage[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  async function handleToggle(message: InboxMessage) {
    if (openId === message.id) {
      setOpenId(null);
      return;
    }
    setOpenId(message.id);
    if (!message.readAt) {
      try {
        await fetch(`/api/inbox/${message.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
      } catch {
        // non-fatal; page still shows the message
      }
      router.refresh();
    }
  }

  if (initialMessages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
        <MailOpen size={32} className="mx-auto mb-3 text-pink-300" />
        <p className="text-sm text-gray-500">No messages yet.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {initialMessages.map((message) => {
        const meta = SENDER_META[message.sender] ?? SENDER_META.vendor;
        const Icon = meta.icon;
        const unread = !message.readAt;
        const open = openId === message.id;

        return (
          <li key={message.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <button
              onClick={() => handleToggle(message)}
              aria-expanded={open}
              className="w-full text-left flex items-center gap-3 p-4 hover:bg-pink-50/50 transition"
            >
              <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${meta.color}`}>
                <Icon size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className={`flex items-center gap-2 text-sm ${unread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                  {meta.label}
                  {unread && <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" aria-label="Unread" />}
                  <span className="ml-auto text-xs font-normal text-gray-400 shrink-0">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </span>
                <span className={`block truncate text-sm ${unread ? "text-gray-800" : "text-gray-500"}`}>
                  {message.subject}
                </span>
              </span>
            </button>
            {open && (
              <div className="px-4 pb-4 pl-[3.25rem]">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.body}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}