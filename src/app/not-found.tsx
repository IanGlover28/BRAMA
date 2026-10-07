import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold text-pink-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-600 mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-pink-600 text-white px-6 py-2.5 rounded-full hover:bg-pink-700 transition text-sm font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}