import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VoucherList from "@/components/voucher-list";

export default async function VouchersPage() {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) redirect("/sign-in");

  const vouchers = await prisma.voucher.findMany({
    where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      label: true,
      description: true,
      discountPct: true,
      expiresAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-1">Vouchers</h1>
        <p className="text-sm text-gray-500 mb-6">
          Apply a voucher code at checkout to save on your order.
        </p>
        <VoucherList initialVouchers={vouchers} />
      </div>
    </div>
  );
}