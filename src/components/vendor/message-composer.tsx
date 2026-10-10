"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Send } from "lucide-react";

interface Customer {
  email: string;
  name: string | null;
}

export default function MessageComposer({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !subject.trim() || !body.trim()) {
      toast.error("Recipient, subject and message are required.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/vendor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");

      toast.success("Message sent.");
      setSubject("");
      setBody("");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
      <h2 className="font-bold text-gray-900">Send a message to a customer</h2>

      <label className="text-sm font-medium text-gray-700 space-y-1 block">
        Recipient
        <select
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="">Select a customer...</option>
          {customers.map((c) => (
            <option key={c.email} value={c.email}>
              {c.name ? `${c.name} · ` : ""}{c.email}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-gray-700 space-y-1 block">
        Subject
        <input
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </label>

      <label className="text-sm font-medium text-gray-700 space-y-1 block">
        Message
        <textarea
          required
          rows={4}
          maxLength={5000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition disabled:bg-pink-400"
        >
          <Send size={15} />
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}