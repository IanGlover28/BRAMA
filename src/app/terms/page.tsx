import { FileText, ShieldCheck, RefreshCcw, Truck, CreditCard, UserRound, Scale } from "lucide-react";

const SECTIONS = [
  {
    icon: FileText,
    title: "1. Agreement",
    body: [
      "These Terms & Conditions (\"Terms\") govern your use of BRAMA and the purchase of our products. By browsing the site or placing an order, you confirm that you have read, understood and agree to these Terms.",
      "If you do not agree with any part of these Terms, please do not use the BRAMA shop. We may update these Terms from time to time, and the latest version will always be available on this page.",
    ],
  },
  {
    icon: Scale,
    title: "2. Products & Orders",
    body: [
      "All product descriptions, images and prices are as accurate as possible but may contain minor variations. Prices are listed in Ghana Cedis (GHS/₵) and may change without prior notice.",
      "An order is confirmed once you complete payment through our secure checkout. We reserve the right to refuse or cancel an order in cases of suspected fraud, pricing errors or stock unavailability, and will refund any amount already paid in such cases.",
    ],
  },
  {
    icon: CreditCard,
    title: "3. Payments & Security",
    body: [
      "Payments are processed securely by Paystack. Your card details are never stored on our servers and are encrypted end-to-end.",
      "On checkout you may apply a valid promo code, which reduces your order total as displayed. Promo codes are non-transferable, have no cash value and may be withdrawn at any time.",
    ],
  },
  {
    icon: Truck,
    title: "4. Shipping & Delivery",
    body: [
      "We deliver to the destination you provide at checkout, within the areas we currently serve. The delivery fee is calculated and shown before you confirm your order.",
      "Estimated delivery times are provided as a guide. Title of the goods transfers to you on delivery. Please inspect your package on receipt and contact us immediately if anything is missing or damaged.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "5. Returns & Refunds",
    body: [
      "If you receive a damaged, incorrect or defective product, contact our support team within 7 days of delivery with your order reference and a photo.",
      "Eligible returns are replaced or refunded to your original payment method. Refunds are typically processed within 5–7 business days after approval.",
    ],
  },
  {
    icon: UserRound,
    title: "6. Privacy & Your Data",
    body: [
      "We collect the information needed to process your orders and improve your experience — such as your name, email, delivery location and order history. We never sell your personal data to third parties.",
      "Your information is used only for order fulfilment, delivery updates and service communications. You may contact us at any time to access, correct or delete your data.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "7. Intellectual Property",
    body: [
      "The BRAMA name, logo, design and all content on this site are the intellectual property of BRAMA. You may not copy, reproduce or use them for commercial purposes without our written permission.",
    ],
  },
  {
    icon: Scale,
    title: "8. Liability",
    body: [
      "Our products are intended for cosmetic use as described. Always patch-test new products. To the maximum extent permitted by law, BRAMA is not liable for indirect or consequential losses arising from use of the site or products.",
    ],
  },
];

export const metadata = {
  title: "Terms & Conditions | BRAMA",
  description: "The terms and privacy policy governing the BRAMA online beauty store.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-pink-900 text-white pt-[200px] md:pt-[150px] pb-24 text-center">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <FileText size={15} className="text-pink-200" />
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Terms & Privacy
          </h1>
          <p className="text-lg text-pink-50 max-w-2xl mx-auto leading-relaxed">
            The fine print, in plain words — how shopping with{" "}
            <span className="text-pink-200 font-semibold">BRAMA</span> works.
          </p>
        </div>
      </section>

      {/* Updated chip */}
      <div className="max-w-3xl mx-auto px-6 -mt-7 relative z-10">
        <p className="bg-white rounded-full border border-gray-100 shadow-sm text-center text-xs font-semibold text-gray-500 py-2">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <section className="max-w-3xl mx-auto px-6 mt-10 space-y-6">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex gap-4"
          >
            <span className="hidden sm:flex items-center justify-center h-11 w-11 shrink-0 rounded-full bg-pink-50 text-pink-600">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-bold text-lg text-gray-900 mb-2 sm:mt-1">{title}</h2>
              <div className="space-y-3">
                {body.map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* Contact card */}
        <article className="bg-gradient-to-br from-pink-600 to-pink-800 text-white rounded-3xl p-7 text-center">
          <h2 className="font-bold text-xl mb-2">Questions about these Terms?</h2>
          <p className="text-pink-100 text-sm mb-5">
            Our team is happy to help. Reach us any time and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:no-reply@brama.com"
            className="inline-flex items-center gap-2 bg-white text-pink-700 px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-50 transition shadow-lg"
          >
            <UserRound size={16} /> Contact BRAMA Support
          </a>
        </article>
      </section>
    </main>
  );
}