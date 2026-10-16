import { prisma } from "@/lib/prisma";
import MessageComposer from "@/components/vendor/message-composer";

export default async function VendorInboxPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { email: true, name: true },
  });

  const sent = await prisma.message.findMany({
    where: { sender: "vendor" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <MessageComposer customers={customers} />

      <div className="bg-surface rounded-xl shadow-sm border overflow-hidden">
        <h2 className="font-bold text-ink-900 p-5 pb-3">Sent messages</h2>
        {sent.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-ink-500">No messages sent yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {sent.map((message) => (
              <li key={message.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm text-ink-900 truncate">
                    {message.subject}
                  </p>
                  <span className="text-xs text-ink-400 shrink-0">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  To: {message.email} · {message.readAt ? "Read" : "Unread"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}