// src/app/admin/products/page.tsx
import Link from "next/link";
import { connectToDatabase } from "@/libs/mongodb";
import Product from "@/models/Products_TEMP";

type ProductDoc = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category?: string;
  inStock?: boolean;
  createdAt?: string;
};

async function getProducts(): Promise<ProductDoc[]> {
  await connectToDatabase();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return docs.map((doc: any) => ({
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    category: doc.category,
    inStock: doc.inStock,
    createdAt: doc.createdAt?.toISOString?.() ?? "",
  }));
}

export const metadata = {
  title: "Products | Elaene Admin",
};

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-slate-500">
            Manage your product catalog, prices and stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          + Add product
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-slate-600">
                Name
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-600">
                Category
              </th>
              <th className="text-right px-4 py-2 font-medium text-slate-600">
                Price
              </th>
              <th className="text-center px-4 py-2 font-medium text-slate-600">
                Stock
              </th>
              <th className="text-right px-4 py-2 font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500 text-sm"
                >
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="underline">
                    Create your first product.
                  </Link>
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-slate-500">{product.slug}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {product.category || "-"}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {product.inStock ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      In stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Out of stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="text-xs font-medium text-slate-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}