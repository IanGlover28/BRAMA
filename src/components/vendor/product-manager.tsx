"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Product } from "@/types/product";

const CATEGORIES = [
  "lipcare",
  "skincare",
  "makeup",
  "haircare",
  "fragrances",
  "bodycare",
];

interface FormData {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: CATEGORIES[0],
  stock: "0",
};

export default function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = initialProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      stock: String(product.stock),
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: form.image,
        category: form.category,
        stock: Number(form.stock),
      };

      const res = await fetch(
        editingId ? `/api/vendor/products/${editingId}` : "/api/vendor/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product.");

      toast.success(editingId ? "Product updated." : "Product created.");
      setShowForm(false);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setDeletingId(product.id);
    try {
      const res = await fetch(`/api/vendor/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product.");

      toast.success("Product deleted.");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-gray-900">
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700 space-y-1 block">
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 space-y-1 block">
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {!CATEGORIES.includes(form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700 space-y-1 block sm:col-span-2">
              Description
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 space-y-1 block">
              Price (₵)
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 space-y-1 block">
              Stock
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 space-y-1 block sm:col-span-2">
              Image path or URL
              <input
                required
                placeholder="/products/my-product.jpg or https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-pink-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition disabled:bg-pink-400"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      )}

      {/* Product list */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No products found.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((product) => (
              <li key={product.id} className="flex items-center gap-4 p-4">
                <div className="relative w-14 h-14 shrink-0 rounded-lg bg-pink-50 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    ₵{product.price.toFixed(2)} · {product.category} ·{" "}
                    <span className={product.stock === 0 ? "text-red-600 font-semibold" : ""}>
                      {product.stock} in stock
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                    className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
