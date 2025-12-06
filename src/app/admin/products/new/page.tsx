// src/app/admin/products/new/page.tsx
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "New Product | Elaene Admin",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Add product</h2>
        <p className="text-sm text-slate-500">
          Create a new product in your Elaene catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
