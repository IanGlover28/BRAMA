import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InboxList from "@/components/inbox-list";
import BackToAccount from "@/components/back-to-account";

export default async function InboxPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) redirect("/sign-in");

  const messages = await prisma.message.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-bold mb-1">Inbox</h1>
        <p className="text-sm text-gray-500 mb-6">
          Messages and notifications from BRAMA.
        </p>
        <InboxList initialMessages={messages} />
      </div>
    </div>
  );
}