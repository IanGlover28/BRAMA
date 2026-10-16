"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/site";

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Support",
    value: CONTACT_EMAIL,
    detail: "We reply within 24 hours.",
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    title: "Call Us",
    value: CONTACT_PHONE_DISPLAY,
    detail: "Mon–Sat, 9am–6pm GMT.",
    href: `tel:${CONTACT_PHONE_TEL}`,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Accra, Ghana",
    detail: "By appointment only.",
    href: `mailto:${CONTACT_EMAIL}`,
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || `Message from ${name}`
    )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
    window.location.href = link;
  };

  return (
    <main className="min-h-screen bg-ink-50 pb-20">
      {/* Header */}
      <section className="bg-surface border-b border-ink-100">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl font-extrabold text-ink-900 mb-3">Contact Us</h1>
          <p className="text-ink-500">
            Questions, orders, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 mt-10 space-y-8">
        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACT_METHODS.map(({ icon: Icon, title, value, detail, href }) => (
            <a
              key={title}
              href={href}
              className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 text-center hover:border-brand-300 hover:shadow-md transition group"
            >
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-50 text-brand-600 mx-auto mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Icon size={22} />
              </span>
              <p className="font-semibold text-ink-900">{title}</p>
              <p className="text-sm text-brand-600 font-medium mt-1">{value}</p>
              <p className="text-xs text-ink-400 mt-1 flex items-center justify-center gap-1">
                <Clock size={12} /> {detail}
              </p>
            </a>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="font-bold text-xl text-ink-900">Send us a message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help?"
              className="w-full rounded-xl border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Tell us more..."
              className="w-full rounded-xl border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-700 transition shadow-md shadow-brand-600/25"
          >
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </main>
  );
}