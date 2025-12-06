// src/app/admin/page.tsx
import Link from "next/link";
import { connectDB } from "@/libs/mongodb";
import Product from "@/models/products";

async function getStats() {
  try {
    await connectDB();
    const productsCount = await Product.countDocuments();
    // Future: orders, revenue etc.
    return { productsCount };
  } catch {
    return { productsCount: 0 };
  }
}

export default async function AdminDashboardPage() {
  const { productsCount } = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-slate-500">
          Quick summary of Elaene store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase">
            Total Products
          </p>
          <p className="text-2xl font-semibold">{productsCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase">
            Orders
          </p>
          <p className="text-2xl font-semibold">0</p>
          <p className="text-xs text-slate-400">
            Orders integration coming next.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase">
            Revenue
          </p>
          <p className="text-2xl font-semibold">$0</p>
          <p className="text-xs text-slate-400">
            Connect payment gateway to track this.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Manage products</h3>
          <p className="text-sm text-slate-500">
            Add new products, update prices, images and stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          + Add product
        </Link>
      </div>
    </div>
  );
}
