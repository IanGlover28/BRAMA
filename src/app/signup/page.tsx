"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLoginMode) {
        // 🔹 LOGIN via next-auth
        const res = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        if (res?.ok) {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => router.push("/"), 1500);
        } else {
          setMessage("Invalid credentials.");
        }
      } else {
        // 🔹 SIGNUP via API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setMessage("Signup successful! You can now log in.");
          setIsLoginMode(true);
        } else {
          const data = await res.json();
          setMessage(data.error || "Signup failed.");
        }
      }
    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Promo Banner */}
      <div className="bg-pink-600 text-white text-center py-2 text-sm">
        🎉 {isLoginMode ? "Welcome back to Exortica!" : "Sign up and get 10% off your first order!"}
      </div>

      {/* Auth Form */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5">
          <h1 className="text-3xl font-bold text-center text-pink-600">
            {isLoginMode ? "Welcome Back!" : "Create Your Exortica Account"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
            >
              {loading
                ? isLoginMode
                  ? "Logging in..."
                  : "Creating..."
                : isLoginMode
                ? "Login"
                : "Create Account"}
            </button>

            {message && (
              <p className="text-center text-sm text-gray-700 mt-3">{message}</p>
            )}
          </form>

          {/* Toggle between forms */}
          <p className="text-center text-sm text-gray-600">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setMessage("");
                setForm({ name: "", email: "", password: "" });
              }}
              className="text-pink-600 font-medium hover:underline"
            >
              {isLoginMode ? "Sign up here" : "Log in here"}
            </button>
          </p>

          {/* Payment Logos */}
          <div className="mt-6 flex justify-center items-center gap-3 flex-wrap">
            {["visa.png", "mastercard.png", "momo.png"].map(
              (img, i) => (
                <Image
                  key={i}
                  src={`/${img}`}
                  alt={img.split(".")[0]}
                  width={50}
                  height={30}
                  className="object-contain"
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
