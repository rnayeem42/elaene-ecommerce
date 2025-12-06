// src/components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProductFormValues = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
};

type Props = {
  initialValues?: ProductFormValues;
};

export default function ProductForm({ initialValues }: Props) {
  const router = useRouter();

  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
      inStock: true,
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialValues?._id);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target as any;

    if (type === "checkbox") {
      setValues((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "price") {
      setValues((prev) => ({ ...prev, price: Number(value) || 0 }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isEditing
        ? `/api/admin/products/${values._id}`
        : "/api/admin/products";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border border-slate-200 rounded-xl p-4 md:p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Slug</label>
          <input
            name="slug"
            value={values.slug}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          />
          <p className="text-xs text-slate-500">
            URL friendly identifier, e.g. <code>smart-watch-01</code>
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Price (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Category</label>
          <input
            name="category"
            value={values.category}
            onChange={handleChange}
            placeholder="Gadgets / Toys / Pets / Kitchen..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Image URL</label>
          <input
            name="imageUrl"
            value={values.imageUrl}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="inStock"
          name="inStock"
          type="checkbox"
          checked={values.inStock}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300"
        />
        <label htmlFor="inStock" className="text-sm">
          In stock
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-70"
        >
          {loading ? "Saving..." : isEditing ? "Update product" : "Create product"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
