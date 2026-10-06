import Link from "next/link";
import { redirect } from "next/navigation";
import { getVendorSession } from "@/lib/vendor";

export const metadata = {
  title: "Vendor Portal | BRAMA Cosmetics",
};

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getVendorSession();
  if (!session) redirect("/signup?error=vendor-only");

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Vendor Portal</h1>
          <span className="text-sm text-gray-500">{session.user?.email}</span>
        </div>

        <nav className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { href: "/vendor", label: "Dashboard" },
            { href: "/vendor/products", label: "Products" },
            { href: "/vendor/orders", label: "Orders" },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-pink-600 hover:border-pink-300 transition"
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
