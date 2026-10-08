"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Support",
    value: "no-reply@brama.com",
    detail: "We reply within 24 hours.",
    href: "mailto:no-reply@brama.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+233 20 000 0000",
    detail: "Mon–Sat, 9am–6pm GMT.",
    href: "tel:+233200000000",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Accra, Ghana",
    detail: "By appointment only.",
    href: "mailto:no-reply@brama.com",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = `mailto:no-reply@brama.com?subject=${encodeURIComponent(
      subject || `Message from ${name}`
    )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
    window.location.href = link;
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500">
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
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center hover:border-pink-300 hover:shadow-md transition group"
            >
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-50 text-pink-600 mx-auto mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Icon size={22} />
              </span>
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="text-sm text-pink-600 font-medium mt-1">{value}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                <Clock size={12} /> {detail}
              </p>
            </a>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="font-bold text-xl text-gray-900">Send us a message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help?"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Tell us more..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-700 transition shadow-md shadow-pink-600/25"
          >
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </main>
  );
}