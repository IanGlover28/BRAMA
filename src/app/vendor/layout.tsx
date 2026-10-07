import { redirect } from "next/navigation";
import { getVendorSession } from "@/lib/vendor";
import VendorNav from "@/components/vendor/vendor-nav";

export const metadata = {
  title: "Vendor Portal | BRAMA Cosmetics",
};

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getVendorSession();
  if (!session) redirect("/sign-in?error=vendor-only");

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Vendor Portal</h1>
        </div>

        <VendorNav />

        {children}
      </div>
    </div>
  );
}
