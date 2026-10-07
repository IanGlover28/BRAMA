import { prisma } from "@/lib/prisma";
import VoucherAdmin from "@/components/vendor/voucher-admin";

export default async function VendorVouchersPage() {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <VoucherAdmin initialVouchers={vouchers} />
    </div>
  );
}